import request from 'supertest';
import Mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import { axios } from '../../../mocks/axios';
import app from '../../../src/app';
import factory from '../../utils/factory';
import Developer from '../../../src/app/models/Developer';
import { to, emit } from '../../../mocks/socket.io';
import Connection from '../../../src/app/models/Connection';
import jwtoken from '../../utils/jwtoken';
import sortByGithubUsername from '../../utils/sortByGithubUsername';
import GetGitHubUser from '../../../src/app/services/GetGitHubUser';
import GetGitHubAccessToken from '../../../src/app/services/GetGitHubAccessToken';

describe('Developer', () => {
  const url = `http://127.0.0.1:${process.env.APP_PORT}/v1`;
  const code = faker.random.alphaNumeric(20);
  const accessToken = faker.random.alphaNumeric(16);

  beforeEach(async () => {
    await Developer.deleteMany();
  });

  afterAll(async () => {
    await Mongoose.disconnect();
  });

  it('should be able to get a list of developers', async () => {
    const developers = await factory.createMany('Developer', 20);

    const response = await request(app).get('/v1/developers').send();

    expect(Array.isArray(response.body)).toBe(true);
    developers
      .sort(sortByGithubUsername)
      .slice(0, 10)
      .forEach(
        ({ _id, name, techs, github_username, avatar_url, bio, location }) => {
          expect(response.body).toContainEqual({
            _id: _id.toString(),
            name,
            techs: [...techs],
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

  it('should be able to get a second page of developers', async () => {
    const developers = await factory.createMany('Developer', 20);

    const response = await request(app).get('/v1/developers?page=2').send();

    expect(Array.isArray(response.body)).toBe(true);
    developers
      .sort(sortByGithubUsername)
      .slice(-10)
      .forEach(
        ({ _id, name, techs, github_username, avatar_url, bio, location }) => {
          expect(response.body).toContainEqual({
            _id: _id.toString(),
            name,
            techs: [...techs],
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

  it('should be able to get a developer', async () => {
    const { _id, name, techs, github_username, bio, avatar_url, location } =
      await factory.create('Developer');

    const response = await request(app).get(`/v1/developers/${_id}`).send();

    expect(response.body).toStrictEqual({
      _id: _id.toString(),
      name,
      techs: [...techs],
      github_username,
      bio,
      avatar_url,
      location: {
        coordinates: [...location.coordinates],
      },
      url: `${url}/developers/${_id}`,
    });
  });

  it('should be able to store a developer', async () => {
    const { name, bio, avatar_url, github_username, techs, location } =
      await factory.attrs('Developer');
    const [longitude, latitude] = location.coordinates;

    axios
      .onPost('https://github.com/login/oauth/access_token')
      .reply(200, { access_token: accessToken })
      .onGet(`https://api.github.com/user`)
      .reply(200, {
        login: github_username,
        name,
        avatar_url,
        bio,
      });

    const response = await request(app)
      .post('/v1/developers')
      .send({ code, techs: techs.join(', '), latitude, longitude });

    expect(response.body).toMatchObject({
      developer: {
        _id: expect.any(String),
        techs: [...techs],
        name,
        avatar_url,
        bio,
        github_username,
        location: {
          coordinates: [...location.coordinates],
        },
      },
      token: expect.any(String),
    });
  });

  it('should not be able to store a developer that already is registered', async () => {
    const { bio, avatar_url, github_username, techs, location } =
      await factory.create('Developer');
    const [longitude, latitude] = location.coordinates;

    axios
      .onPost('https://github.com/login/oauth/access_token')
      .reply(200, { access_token: accessToken })
      .onGet(`https://api.github.com/user`)
      .reply(200, {
        login: github_username,
        avatar_url,
        bio,
      });

    const response = await request(app)
      .post('/v1/developers')
      .send({ code, techs: techs.join(', '), latitude, longitude });

    expect(response.body).toStrictEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'You are already registered',
      code: 140,
      docs: process.env.DOCS_URL,
    });
  });

  it('should be able to emit a new developer', async () => {
    const { name, bio, avatar_url, github_username, techs, location } =
      await factory.attrs('Developer');
    const [longitude, latitude] = location.coordinates;
    const socket_id = faker.random.alphaNumeric(12);

    axios
      .onPost('https://github.com/login/oauth/access_token')
      .reply(200, { access_token: accessToken })
      .onGet(`https://api.github.com/user`)
      .reply(200, {
        login: github_username,
        name,
        avatar_url,
        bio,
      });

    await Connection.create({
      socket_id,
      location: {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)],
      },
      techs,
    });

    const response = await request(app)
      .post('/v1/developers')
      .send({
        code,
        techs: techs.join(', '),
        latitude,
        longitude,
      });

    const { _id } = await Developer.findOne();

    expect(to).toHaveBeenCalledWith(socket_id);
    expect(emit).toHaveBeenCalledWith('developer', {
      _id,
      name,
      bio,
      avatar_url,
      github_username,
      techs,
      location: {
        coordinates: [longitude, latitude],
      },
    });
    expect(response.body).toMatchObject({
      developer: {
        _id: expect.any(String),
        name,
        github_username,
        avatar_url,
        bio,
        techs: [...techs],
        location: {
          coordinates: [longitude, latitude],
        },
      },
      token: expect.any(String),
    });
    expect(response.body.token);
  });

  it('should be able to update a developer', async () => {
    const { _id, github_username } = await factory.create('Developer');
    const { name, avatar_url, bio, techs, location } =
      await factory.attrs('Developer');
    const token = jwtoken(_id);
    const [longitude, latitude] = location.coordinates;

    const response = await request(app)
      .put(`/v1/developers`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        techs: techs.join(', '),
        name,
        avatar_url,
        bio,
        latitude,
        longitude,
      });

    expect(response.body).toStrictEqual({
      _id: _id.toString(),
      name,
      bio,
      github_username,
      avatar_url,
      techs,
      location: {
        coordinates: [longitude, latitude],
      },
    });
  });

  it('should not be able to update a developer that not exists', async () => {
    const { _id } = await factory.create('Developer');
    const token = jwtoken(_id);

    await Developer.findByIdAndDelete({ _id });

    const { body } = await request(app)
      .put(`/v1/developers`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .send({ name: faker.name.fullName() });

    expect(body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      message: 'Developer does not exists',
      code: 144,
      docs: process.env.DOCS_URL,
    });
  });

  it('should be able to delete a developer', async () => {
    const { _id } = await factory.create('Developer');
    const token = jwtoken(_id);

    await request(app)
      .delete(`/v1/developers`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    expect(await Developer.findById(_id)).toBeNull();
  });

  it('should not be able to delete a developer that not exists', async () => {
    const { _id } = await factory.create('Developer');
    const token = jwtoken(_id);

    await Developer.findByIdAndDelete({ _id });

    const response = await request(app)
      .delete(`/v1/developers`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .send();

    expect(response.body).toStrictEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Developer does not exists',
      code: 144,
      docs: process.env.DOCS_URL,
    });
  });

  it('should not be able to retrieve an user from github', async () => {
    axios.onGet('https://api.github.com/user').reply(400, 'Bad Request');

    const getGitHubUser = new GetGitHubUser();
    getGitHubUser.execute({ access_token: accessToken }).catch((err) => {
      expect({ ...err }).toStrictEqual({
        data: {
          code: 532,
          details: {
            status: 400,
            statusText: 'Bad Request',
          },
        },
        isBoom: true,
        isServer: true,
        output: {
          headers: {},
          payload: {
            error: 'Service Unavailable',
            message:
              'An error ocurred while trying to retrieve the user from GitHub',
            statusCode: 503,
          },
          statusCode: 503,
        },
      });
    });
  });

  it('should not be able to retrieve an access token from github', async () => {
    axios
      .onGet('https://github.com/login/oauth/access_token')
      .reply(400, 'Bad Request');

    const getGitHubAccessToken = new GetGitHubAccessToken();
    getGitHubAccessToken.execute({ code }).catch((err) => {
      expect({ ...err }).toStrictEqual({
        data: {
          code: 531,
          details: {
            status: 400,
            statusText: 'Bad Request',
          },
        },
        isBoom: true,
        isServer: true,
        output: {
          headers: {},
          payload: {
            error: 'Service Unavailable',
            message:
              "An error ocurred while trying to exchange a GitHub's access token",
            statusCode: 503,
          },
          statusCode: 503,
        },
      });
    });
  });
});
