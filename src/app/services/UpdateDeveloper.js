import parseStringToArray from '../helpers/parseStringToArray';
import ExistsDeveloper from './ExistsDeveloper';

class UpdateDeveloper {
  async run({ id, techs, latitude, longitude, ...params }) {
    let developer = await ExistsDeveloper.run({ id });

    if (typeof techs === 'string') {
      developer.techs = parseStringAsArray(techs);
    }

    ['name', 'avatar_url', 'bio'].forEach(field => {
      if (typeof params[field] === 'string') {
        developer[field] = params[field];
      }
    });

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      developer.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }


    return developer;
  }
}

export default new UpdateDeveloper();
