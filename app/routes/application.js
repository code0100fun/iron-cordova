import Ember from 'ember';
import faker from 'faker';

function avatar(width, height) {
  return `https://www.placecage.com/gif/${width}/${height}`;
}

export default Ember.Route.extend({
  model() {
    const items = [];
    for(let i = 0; i < 100; i++) {
      const width = faker.random.number({ min: 4, max: 8 }) * 20;
      const height = faker.random.number({ min: 3, max: 6 }) * 20;
      items.push({
        id: 0,
        width: width + 30, height: height + 50,
        name: faker.name.findName(),
        lastText: faker.lorem.sentence(),
        image: avatar(width, height)
      });
    }
    return Ember.A({ items });
  }
});
