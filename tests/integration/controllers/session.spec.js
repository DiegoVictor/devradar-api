import request from 'supertest';
import Mongoose from 'mongoose';
import faker from 'faker';

import app from '../../../src/app';
import factory from '../../utils/factory';
import Developer from '../../../src/app/models/Developer';
import { axios } from '../../../mocks/axios';

describe('Session', () => {
  const code = faker.random.alphaNumeric(20);
  const accessToken = faker.random.alphaNumeric(16);

  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to logon', async () => {
    const {
      name,
      avatar_url,
      bio,
      github_username,
      location,
      techs,
    } = await factory.create('Developer');

    axios
      .onPost('https://github.com/login/oauth/access_token')
      .reply(200, { access_token: accessToken })
      .onGet(`https://api.github.com/user`)
      .reply(200, {
        login: github_username,
      });

    const response = await request(app)
      .post('/v1/sessions')
      .send({ code });

    expect(response.body).toStrictEqual({
      developer: {
        _id: expect.any(String),
        name,
        avatar_url,
        bio,
        github_username,
        location: {
          coordinates: [...location.coordinates],
        },
        techs: [...techs],
      },
      token: expect.any(String),
    });
  });

  it('should not be able to logon with an ngo that not exists', async () => {
    const response = await request(app)
      .post('/v1/sessions')
      .expect(404)
      .send({ code });

    expect(response.body).toStrictEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Developer does not exists',
      code: 144,
      docs: process.env.DOCS_URL,
    });
  });
});
