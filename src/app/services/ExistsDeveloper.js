import { notFound } from '@hapi/boom';

import Developer from '../models/Developer';

class ExistsDeveloper {
  async run({ id }) {
    const developer = await Developer.findById(id, {
      'location._id': false,
      'location.type': false,
      __v: false,
    }).lean();
    if (!developer) {
      throw notFound('Developer does not exists', { code: 144 });
    }

    return developer;
  }
}

export default new ExistsDeveloper();
