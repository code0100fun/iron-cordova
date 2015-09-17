import Ember from 'ember';
import Waterfall from 'waterfall-layout/layouts/waterfall';

export default Ember.Helper.helper(function (params, { length, width, height, reuse, spacing, columns, columnWidth }) {
  return new Waterfall({
    cellCount: length,
    cellWidth: width,
    cellHeight: height,
    reuse,
    spacing,
    columns,
    columnWidth
  });
});
