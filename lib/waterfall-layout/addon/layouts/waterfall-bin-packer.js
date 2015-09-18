import Bin from 'layout-bin-packer/bin';

export default function WaterfallBinPacker(options) {
  this._super$constructor();
  this.cellCount = options.cellCount;
  this.cellWidth = options.cellWidth;
  this.cellHeight = options.cellHeight;
  this.columnWidth = options.columnWidth;
  this.columns = options.columns;
  this.reuseCell = options.reuseCell;
  this.spacing = options.spacing;
}

WaterfallBinPacker.prototype = Object.create(Bin.prototype);
WaterfallBinPacker.prototype._super$constructor = Bin;

WaterfallBinPacker.prototype._columnWidth = function(containerWidth) {
  return Math.floor(this.columnWidth ||
    (this.columns && (containerWidth - this.spacing * (this.columns + 1)) / this.columns) ||
    this.widthAtIndex(0));
};

WaterfallBinPacker.prototype._columnSpacing = function(containerWidth) {
  return Math.floor(this.columnWidth ||
    (this.columns && containerWidth / this.columns) ||
    this.widthAtIndex(0));
};

WaterfallBinPacker.prototype._columns = function(containerWidth) {
  const columnWidth = this._columnWidth(containerWidth);
  return Math.ceil(this.columns || containerWidth / columnWidth);
};

WaterfallBinPacker.prototype._initGrid = function(containerWidth) {
  this.grid = { width: containerWidth, columns: [] };
  this.cells = [];
  const columns = this._columns(containerWidth);
  for (let c = 0; c < columns; c++) {
    this.grid.columns[c] = [];
  }
};

WaterfallBinPacker.prototype._columnHeight = function(col) {
  const column = this.grid.columns[col];
  const last = column[column.length - 1];
  return (last && last.height) || 0;
};

WaterfallBinPacker.prototype._shortestColumn = function() {
  let minHeight;
  let index;
  const columns = this.grid.columns.length;
  for (let i = 0; i < columns; i++) {
    const height = this._columnHeight(i);
    if (typeof(minHeight) === 'undefined' || height < minHeight) {
      minHeight = height;
      index = i;
    }
  }
  return [index, minHeight];
};

WaterfallBinPacker.prototype._prepareGrid = function(containerWidth) {
  this._initGrid(containerWidth);
  const columnWidth = this._columnWidth(containerWidth);
  const length = this.length();
  for (let i = 0; i < length; i++) {
    const cellHeight = this.cellHeight(i, columnWidth);
    const shortest = this._shortestColumn();
    const col = shortest[0];
    const prevHeight = shortest[1];
    const height = prevHeight + cellHeight + this.spacing;
    const x = (col * columnWidth) + (this.spacing * (col + 1));
    const y = prevHeight + this.spacing;
    const cell = { x, y, width: columnWidth, height };
    this.cells[i] = cell;
    this.grid.columns[col].push(cell);
  }
};

WaterfallBinPacker.prototype.flush = function(/* index, to */) {

};

WaterfallBinPacker.prototype.isGrid = function(/*width*/) {
  return false;
};

WaterfallBinPacker.prototype.visibleStartingIndex = function(topOffset, width, height) {
  topOffset = Math.min(topOffset, this.maxContentOffset(width, height));
  const columns = this._columns(width);
  return Math.floor(topOffset / this.heightAtIndex(0)) * columns;
};

WaterfallBinPacker.prototype.numberVisibleWithin = function(topOffset, width, height, withPadding) {
  var startingIndex = this.visibleStartingIndex(topOffset, width, height);
  var columns = Math.floor(width / this.widthAtIndex(0)) || 1;
  var length = this.length();

  var rowHeight = this.heightAtIndex(0);
  var rows = Math.ceil(height / rowHeight);

  var maxNeeded = rows * columns;

  if (withPadding) {
    maxNeeded += columns;
  }

  var potentialVisible = length - startingIndex;

  return Math.max(Math.min(maxNeeded, potentialVisible), 0);
};

WaterfallBinPacker.prototype.position = function(index/*, width*/) {
  if (!this.cells || !this.cells[index]) {
    return { x: 0, y: 0 };
  }
  const cell = this.cells[index];
  return { x: cell.x, y: cell.y };
};

WaterfallBinPacker.prototype.height = function(visibleWidth) {
  if (!this.grid ||
      this.grid.width !== visibleWidth ||
        this.grid.columns.length !== this._columns(visibleWidth)) {
    this._prepareGrid(visibleWidth);
  }
  if (typeof visibleWidth !== 'number') {
    throw new TypeError('height depends on the first argument of visibleWidth(number)');
  }
  var length = this.length();
  if (length === 0) { return 0; }

  var columnCount = Math.max(Math.floor(visibleWidth/this.widthAtIndex(0), 1));
  columnCount = columnCount > 0 ? columnCount : 1;
  var rows = Math.ceil(length/columnCount);
  var totalHeight = rows * this.heightAtIndex(0);

  return totalHeight;
};

WaterfallBinPacker.prototype.widthAtIndex = function(index) {
  if (!this.cells || !this.cells[index]) {
    return 0;
  }
  return this.cells[index].width;
};

WaterfallBinPacker.prototype.heightAtIndex = function(index) {
  if (!this.cells || !this.cells[index]) {
    return 0;
  }
  return this.cells[index].height;
};

WaterfallBinPacker.prototype.length = function() {
  return this.cellCount();
};
