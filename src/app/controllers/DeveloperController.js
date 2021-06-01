import createToken from '../helpers/createToken';
import Developer from '../models/Developer';
import ExistsDeveloper from '../services/ExistsDeveloper';
import CreateDeveloper from '../services/CreateDeveloper';
import UpdateDeveloper from '../services/UpdateDeveloper';
import paginationLinks from '../helpers/paginationLinks';

const existsDeveloper = new ExistsDeveloper();
const createDeveloper = new CreateDeveloper();
const updateDeveloper = new UpdateDeveloper();

class DeveloperController {
  async index(req, res) {
    const { current_url } = req;
    const { page = 1 } = req.query;
    const limit = 10;

    const developers = await Developer.find(null, {
      'location._id': false,
      'location.type': false,
      __v: false,
    })
      .sort('github_username')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

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

    const developer = await existsDeveloper.execute({ id });

    return res.json({
      ...developer.toObject(),
      url: current_url,
    });
  }

  async store(req, res) {
    const developer = await createDeveloper.execute(req.body);
    return res.json({
      developer,
      token: createToken(developer._id),
    });
  }

  async update(req, res) {
    const { id } = req;

    return res.json(
      await updateDeveloper.execute({
        id,
        ...req.body,
      })
    );
  }

  async destroy(req, res) {
    const { id } = req;

    const developer = await existsDeveloper.execute({ id });
    await developer.remove();

    return res.sendStatus(204);
  }
}

export default DeveloperController;
