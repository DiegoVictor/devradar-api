import parseStringToArray from '../helpers/parseStringToArray';
import ExistsDeveloper from './ExistsDeveloper';
import EmitDeveloper from './EmitDeveloper';
import Developer from '../models/Developer';

class UpdateDeveloper {
  async execute({ id, techs, latitude, longitude, name, avatar_url, bio }) {

    let location;
    if (latitude && longitude) {
      location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    const developer = await Developer.findByIdAndUpdate(
      id,
      {
        name,
        avatar_url,
        bio,
        techs: techs ? parseStringToArray(techs) : techs,
        location,
      },
      {
        omitUndefined: true,
        projection: {
          'location._id': false,
          'location.type': false,
          __v: false,
        },
        new: true,
      }
    ).lean();

    if (location) {
      await EmitDeveloper.run({ developer });
    }

    return developer;
  }
}

export default UpdateDeveloper;
