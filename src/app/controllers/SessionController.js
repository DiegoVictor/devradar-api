import { notFound } from '@hapi/boom';

import createToken from '../helpers/createToken';
import Developer from '../models/Developer';
import GetGitHubAccessToken from '../services/GetGitHubAccessToken';
import GetGitHubUser from '../services/GetGitHubUser';

const getGitHubUser = new GetGitHubUser();
const getGitHubAccessToken = new GetGitHubAccessToken();

class SessionController {
  async store(req, res) {
    const { code } = req.body;
    const accessToken = await getGitHubAccessToken.execute({ code });
    const { login: githubUsername } = await getGitHubUser.execute({
      access_token: accessToken,
    });

    const developer = await Developer.findOne(
      { github_username: githubUsername },
      { 'location._id': false, 'location.type': false, __v: false }
    ).lean();

    if (!developer) {
      throw notFound('Developer does not exists', { code: 144 });
    }

    return res.json({
      developer,
      token: createToken(developer._id),
    });
  }
}

export default SessionController;
