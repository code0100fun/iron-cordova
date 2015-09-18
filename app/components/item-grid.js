import Ember from 'ember';

export default Ember.GlimmerComponent.extend({
  items: Ember.computed('attrs.items', 'width', 'height', function() {
    return this.get('attrs.items').map(function(item) {
      return Ember.ObjectProxy.create({ content: item });
    });
  }),
  init() {
    this.set('height', 0);
    this.set('width', 0);
    this.get('resizeService').on('didResize', event => {
      this.updateSize();
    });
  },
  actions: {
    cellHeight(index, cellWidth) {
      const item = this.get('items')[index];
      const padding = 15;

      const scaledWidth = cellWidth - padding * 2;
      item.set('image.scaledWidth', scaledWidth);
      item.set('width', cellWidth);

      const aspect = item.get('image.width') / item.get('image.height');
      const captionHeight = 49;
      const scaledHeight = Math.round(cellWidth / aspect);
      const cellHeight =  scaledHeight + captionHeight + padding * 2;
      item.set('image.scaledHeight', scaledHeight);
      item.set('height', cellHeight);

      return cellHeight;
    },
    cellCount() {
      return this.get('items').length;
    }
  },
  columnWidth: Ember.computed('width', 'columns', function() {
    return Math.floor(this.get('width') / this.get('columns'));
  }),
  columns: Ember.computed('width', function() {
    const width = this.get('width');
    const min = this.get('minColumnWidth');
    const max = this.get('maxColumnWidth');
    const maxCols =  width / min;
    const minCols =  width / max;
    const columns = maxCols > minCols ? Math.ceil(maxCols) : Math.ceil(minCols);
    console.log('width', width);
    return Math.max(columns, 1);
  }),
  minColumnWidth: 250,
  maxColumnWidth: 300,
  spacing: 5,
  updateSize() {
    this.set('width', this.$().width());
    this.set('height', this.$().height());
  },
  didInsertElement() {
    Ember.run(() => {
      this.updateSize();
    });
  }
});
