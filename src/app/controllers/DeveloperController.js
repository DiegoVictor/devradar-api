import Developer from '../models/Developer';
import ExistsDeveloper from '../services/ExistsDeveloper';
import StoreDeveloper from '../services/StoreDeveloper';
import UpdateDeveloper from '../services/UpdateDeveloper';
import paginationLinks from '../helpers/paginationLinks';

class DeveloperController {
  async index(req, res) {
    const { current_url } = req;
    const { page = 1 } = req.query;
    const limit = 10;

    const developers = await Developer.find(
      {},
      {
        'location._id': false,
        'location.type': false,
        __v: false,
      }
    ).lean();

    const count = await Developer.countDocuments();
    res.header('X-Total-Count', count);

    const pages_total = Math.ceil(count / limit);
    if (pages_total > 1) {
      res.links(paginationLinks(page, pages_total, current_url));
    }

    return res.json(
      developers.map(developer => ({
        ...developer,
        url: `${current_url}/${developer._id}`,
      }))
    );
  }

  async show(req, res) {
    const { current_url } = req;
    const { id } = req.params;

    const developer = await ExistsDeveloper.run({ id });

    return res.json({
      ...developer,
      url: current_url,
    });
  }

    return res.json(developer);
  }

  async update(req, res) {
    const { id } = req.params;

    return res.json(
      await UpdateDeveloper.run({
        developer: await ExistsDeveloper.run({ id }),
        ...req.body,
      })
    );
  }

  async destroy(req, res) {
    const { id } = req.params;
    const developer = await ExistsDeveloper.run({ id });

    await developer.remove();

    return res.sendStatus(204);
  }
}

export default new DeveloperController();
