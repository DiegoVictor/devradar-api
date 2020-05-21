import { badRequest } from '@hapi/boom';

import parseStringToArray from '../helpers/parseStringToArray';
import Developer from '../models/Developer';
import GetGitHubUser from './GetGitHubUser';
import GetGitHubAccessToken from './GetGitHubAccessToken';
import EmitDeveloper from './EmitDeveloper';

class CreateDeveloper {
  async run({ code, techs, latitude, longitude }) {
    const access_token = await GetGitHubAccessToken.run({ code });
    const {
      login: github_username,
      name = github_username,
      avatar_url,
      bio,
    } = await GetGitHubUser.run({
      access_token,
    });

    if (await Developer.findOne({ github_username })) {
      throw badRequest('You are already registered!', { code: 140 });
    }

    const developer = {
      name,
      avatar_url,
      bio,
      github_username,
      techs: parseStringToArray(techs),
      location: {
        coordinates: [longitude, latitude],
      },
    };

    const { _id } = await Developer.create({
      ...developer,
      location: {
        type: 'Point',
        ...developer.location,
      },
    });
    developer._id = _id;

    await EmitDeveloper.run({ developer });

    return developer;
  }
}

export default new CreateDeveloper();
