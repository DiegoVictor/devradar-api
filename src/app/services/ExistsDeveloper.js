import { notFound } from '@hapi/boom';

import Developer from '../models/Developer';

class ExistsDeveloper {
  async execute({ id }) {
    const developer = await Developer.findById(id, {
      'location._id': false,
      'location.type': false,
      __v: false,
    });

    if (!developer) {
      throw notFound('Developer does not exists', { code: 144 });
    }

    return developer;
  }
}

export default ExistsDeveloper;
