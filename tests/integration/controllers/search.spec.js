import request from 'supertest';
import Mongoose from 'mongoose';
import faker from '@faker-js/faker';

import app from '../../../src/app';
import factory from '../../utils/factory';
import Developer from '../../../src/app/models/Developer';

describe('Search', () => {
  const url = `http://127.0.0.1:${process.env.APP_PORT}/v1`;

  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of near developers', async () => {
    const techs = faker.lorem.word();
    const longitude = faker.address.longitude();
    const latitude = faker.address.latitude();

    const developers = await factory.createMany('Developer', 3, {
      techs: [techs],
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    const response = await request(app).get(
      `/v1/search?latitude=${latitude}&longitude=${longitude}&techs=${techs}`
    );

    expect(Array.isArray(response.body)).toBe(true);
    developers.forEach(
      ({ _id, name, github_username, bio, avatar_url, location }) => {
        expect(response.body).toContainEqual({
          _id: _id.toString(),
          techs: [techs],
          name,
          github_username,
          bio,
          avatar_url,
          location: {
            coordinates: [...location.coordinates],
          },
          url: `${url}/developers/${_id}`,
        });
      }
    );
  });
});
