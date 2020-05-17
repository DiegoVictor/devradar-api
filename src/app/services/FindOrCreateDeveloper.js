import parseStringAsArray from '../helpers/parseStringAsArray';
import { emit } from '../../websocket';
import Developer from '../models/Developer';
import Connection from '../models/Connection';
import GetGitHubAccessToken from './GetGitHubAccessToken';
import GetGitHubUser from './GetGitHubUser';

class FindOrCreateDeveloper {
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

    techs = parseStringAsArray(techs);

    const {
      value: developer,
      lastErrorObject: { updatedExisting },
    } = await Developer.findOneAndUpdate(
      { github_username },
      {
        name,
        avatar_url,
        bio,
        github_username,
        techs,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
      {
        new: true,
        upsert: true,
        rawResult: true,
        fields: {
          'location._id': false,
          'location.type': false,
          __v: false,
        },
      }
    ).lean();

    if (!updatedExisting) {
      const connections = await Connection.find(
        {
          techs: {
            $in: techs,
          },
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              $maxDistance: 10000,
            },
          },
        },
        {
          'location._id': false,
          'location.type': false,
          __v: false,
        }
      );

      connections.forEach(({ socket_id }) => {
        emit(socket_id, 'new_developer', developer);
      });
    }

    return developer;
  }
}

export default new FindOrCreateDeveloper();
