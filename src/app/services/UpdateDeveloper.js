import parseStringAsArray from '../helpers/parseStringAsArray';
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

    await developer.save();

    return developer;
  }
}

export default new UpdateDeveloper();
