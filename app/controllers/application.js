import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    destroy(item) {
      alert(`destroy ${item.name}`);
    },
    edit(item) {
      alert(`edit ${item.name}`);
    },
    cellHeight(index, cellWidth) {
      const item = this.get('model.items')[index];
      const padding = 15;

      const scaledWidth = cellWidth - padding * 2;
      item.scaledWidth = scaledWidth;

      const aspect = item.width / item.height;
      const captionHeight = 49;
      const scaledHeight = Math.round(cellWidth / aspect);
      item.scaledHeight = scaledHeight;

      return scaledHeight + captionHeight + padding * 2;
    },
    cellCount() {
      return this.get('model.items').length;
    }
  },
  columnWidth: Ember.computed('width', 'columns', function() {
    return Math.floor(this.get('width') / this.get('columns'));
  }),
  columns: 3,
  width: window.innerWidth,
  height: window.innerHeight,
  spacing: 5
});
