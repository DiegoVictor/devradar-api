import { factory } from 'factory-girl';
import { faker } from '@faker-js/faker';

import Developer from '../../src/app/models/Developer';

factory.define('Developer', Developer, {
  name: faker.person.fullName,
  github_username: faker.internet.username,
  bio: faker.lorem.paragraph,
  avatar_url: faker.image.url,
  techs: () => {
    const techs = [];
    for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i += 1) {
      techs.push(faker.lorem.word());
    }
    return techs;
  },
  location: {
    type: 'Point',
    coordinates: [
      Number(faker.location.longitude()),
      Number(faker.location.latitude()),
    ],
  },
});

export default factory;
