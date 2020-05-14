import axios from 'axios';
import { serverUnavailable } from '@hapi/boom';

class GetGitHubUser {
  async run({ access_token }) {
    try {
      const { data } = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });

      return data;
    } catch ({ response: { status, statusText } }) {
      throw serverUnavailable(
        'An error ocurred while trying to retrieve the user from GitHub',
        {
          code: 532,
          details: {
            status,
            statusText,
          },
        }
      );
    }
  }
}

export default new GetGitHubUser();
