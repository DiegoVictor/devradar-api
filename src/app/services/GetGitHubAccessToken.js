import axios from 'axios';

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
    } catch (err) {
      // TODO
    }
  }
}

export default new GetGitHubAccessToken();
