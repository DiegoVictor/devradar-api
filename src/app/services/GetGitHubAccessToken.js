import axios from 'axios';
import { serverUnavailable } from '@hapi/boom';

class GetGitHubAccessToken {
  async run({ code }) {
    try {
      const {
        data: { access_token },
      } = await axios.post(
        'https://github.com/login/oauth/access_token',
        {},
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
          },
          headers: {
            Accept: 'application/json',
          },
        }
      );

      return access_token;
    } catch ({ response: { status, statusText } }) {
      throw serverUnavailable(
        "An error ocurred while trying to exchange a GitHub's access token",
        {
          code: 531,
          details: {
            status,
            statusText,
          },
        }
      );
    }
  }
}

export default new GetGitHubAccessToken();
