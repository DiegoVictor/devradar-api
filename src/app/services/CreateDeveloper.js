import { badRequest } from '@hapi/boom';

import parseStringToArray from '../helpers/parseStringToArray';
import Developer from '../models/Developer';
import GetGitHubUser from './GetGitHubUser';
import GetGitHubAccessToken from './GetGitHubAccessToken';
import EmitDeveloper from './EmitDeveloper';

const emitDeveloper = new EmitDeveloper();
const getGitHubAccessToken = new GetGitHubAccessToken();
const getGitHubUser = new GetGitHubUser();

class CreateDeveloper {
  async execute({ code, techs, latitude, longitude }) {
    const access_token = await getGitHubAccessToken.execute({ code });
    const {
      login: github_username,
      name = github_username,
      avatar_url,
      bio,
    } = await getGitHubUser.execute({
      access_token,
    });

    if (await Developer.findOne({ github_username })) {
      throw badRequest('You are already registered', { code: 140 });
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

    await emitDeveloper.execute({ developer });

    return developer;
  }
}

export default CreateDeveloper;
