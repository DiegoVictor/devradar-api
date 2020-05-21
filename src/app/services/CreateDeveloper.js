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

    const developer = await Developer.create({
      name,
      avatar_url,
      bio,
      github_username,
      techs: parseStringToArray(techs),
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    await EmitDeveloper.run({ developer });

    return {
      ...developer.toObject({ versionKey: false }),
      location: {
        coordinates: [longitude, latitude],
      },
    };
  }
}

export default new CreateDeveloper();
