import parseStringAsArray from '../helpers/parseStringAsArray';
import Developer from '../models/Developer';

class SearchController {
  async index(req, res) {
    const { latitude, longitude, techs } = req.query;

    return res.json(
      developers.map(developer => ({
        ...developer,
        url: `${host_url}/v1/developers/${developer._id}`,
      }))
    );
  }
}

export default new SearchController();
