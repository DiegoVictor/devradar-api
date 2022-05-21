import faker from '@faker-js/faker';
import jwt from 'jsonwebtoken';

import bearerAuth from '../../../src/app/middlewares/bearerAuth';

describe('BearerAuth', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(response => response),
  };

  it('should not be able to request without a token', () => {
    const req = { headers: {} };
    bearerAuth(req, res, jest.fn()).catch(err => {
      expect({ ...err }).toStrictEqual({
        data: { code: 240 },
        isBoom: true,
        isServer: false,
        output: {
          statusCode: 400,
          payload: {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Missing authorization token',
          },
          headers: {},
        },
      });
    });
  });

  it('should not be able to request with a invalid token', async () => {
    const req = {
      headers: {
        authorization: `Bearer ${jwt.sign(
          { id: faker.datatype.number() },
          faker.random.alphaNumeric(29),
          {
            expiresIn: '-1d',
          }
        )}`,
      },
    };

    const message = 'Token expired or invalid';
    bearerAuth(req, res, jest.fn()).catch(err => {
      expect({ ...err }).toStrictEqual({
        data: null,
        isBoom: true,
        isServer: false,
        output: {
          statusCode: 401,
          payload: {
            attributes: {
              code: 241,
              error: message,
            },
            statusCode: 401,
            error: 'Unauthorized',
            message,
          },
          headers: {
            'WWW-Authenticate': `sample code="241", error="${message}"`,
          },
        },
      });
    });
  });
});
