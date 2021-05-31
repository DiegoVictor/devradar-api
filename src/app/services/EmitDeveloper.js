import { emit } from '../../websocket';
import Connection from '../models/Connection';

class EmitDeveloper {
  async execute({ developer }) {
    const connections = await Connection.find(
      {
        techs: {
          $in: developer.techs,
        },
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: developer.location.coordinates,
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
      emit(socket_id, 'developer', developer);
    });
  }
}

export default new EmitDeveloper();
