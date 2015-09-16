import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    destroy(item) {
      alert(`destroy ${item.name}`);
    },
    edit(item) {
      alert(`edit ${item.name}`);
    }
  }
});
