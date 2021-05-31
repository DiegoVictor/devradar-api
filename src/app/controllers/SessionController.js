import { notFound } from '@hapi/boom';

import createToken from '../helpers/createToken';
import Developer from '../models/Developer';
import GetGitHubAccessToken from '../services/GetGitHubAccessToken';
import GetGitHubUser from '../services/GetGitHubUser';

class SessionController {
  async store(req, res) {
    const { code } = req.body;
    const access_token = await GetGitHubAccessToken.run({ code });
    const { login: github_username } = await GetGitHubUser.run({
      access_token,
    });

    const developer = await Developer.findOne(
      { github_username },
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
