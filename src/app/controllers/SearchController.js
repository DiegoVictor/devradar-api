import Developer from '../models/Developer';
import parseStringToArray from '../helpers/parseStringToArray';

class SearchController {
  async index(req, res) {
    const { host_url } = req;
    const { techs, longitude, latitude } = req.query;

    const developers = await Developer.find(
      {
        techs: {
          $in: Array.isArray(techs) ? techs : parseStringToArray(techs),
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
    ).lean();

    return res.json(
      developers.map(developer => ({
        ...developer,
        url: `${host_url}/v1/developers/${developer._id}`,
      }))
    );
  }
}

export default new SearchController();
