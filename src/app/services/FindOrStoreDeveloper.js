import axios from 'axios';

import parseStringAsArray from '../helpers/parseStringAsArray';
import { emit } from '../../websocket';
import Developer from '../models/Developer';
import Connection from '../models/Connection';
import FindNear from './FindNear';

class FindOrStoreDeveloper {
  async run({ code, techs, latitude, longitude }) {
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

    const { data } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const { login, name = login, avatar_url, bio } = data;

    techs = parseStringAsArray(techs);

    let developer = await Developer.findOne({ github_username: login });
    if (!developer) {
      developer = await Developer.create({
        name,
        avatar_url,
        bio,
        github_username: login,
        techs,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      });

      emit(
        await FindNear.run(Connection, {
          latitude,
          longitude,
          techs,
        }),
        'new_developer',
        developer
      );
    }

    return developer;
  }
}

export default new FindOrStoreDeveloper();
