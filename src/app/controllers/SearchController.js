import Developer from '../models/Developer';
import parseStringAsArray from '../helpers/parseStringAsArray';

class SearchController {
  async index(req, res) {
    const { host_url } = req;
    const { techs, longitude, latitude } = req.query;

    const developers = await Developer.find(
      {
        techs: {
          $in: Array.isArray(techs) ? techs : parseStringAsArray(techs),
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

    return res.json(
      developers.map(developer => ({
        ...developer,
        url: `${host_url}/v1/developers/${developer._id}`,
      }))
    );
  }
}

export default new SearchController();
