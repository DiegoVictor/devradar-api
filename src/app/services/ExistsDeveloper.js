import { badRequest } from '@hapi/boom';

import Developer from '../models/Developer';

class ExistsDeveloper {
  async run({ id }) {
    const developer = await Developer.findById(id);
    if (!developer) {
      throw notFound('Developer does not exists', { code: 144 });
    }

    return developer;
  }
}

export default new ExistsDeveloper();
