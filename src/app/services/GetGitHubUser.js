import axios from 'axios';

class GetGitHubUser {
  async run({ access_token }) {
    try {
      const { data } = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });

      return data;
    } catch (err) {
      // TODO
    }
  }
}

export default new GetGitHubUser();
