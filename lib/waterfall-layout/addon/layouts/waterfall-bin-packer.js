import Bin from 'layout-bin-packer/bin';

export default class WaterfallBinPacker extends Bin {
  constructor(options) {
    super();
    this.cellCount = options.cellCount;
    this.cellWidth = options.cellWidth;
    this.cellHeight = options.cellHeight;
    this.columnWidth = options.columnWidth;
    this.columns = options.columns;
    this.reuseCell = options.reuseCell;
    this.spacing = options.spacing;
  }

  _columnWidth(containerWidth) {
    return Math.floor(this.columnWidth ||
      (this.columns && (containerWidth - this.spacing * (this.columns + 1)) / this.columns) ||
      this.widthAtIndex(0));
  }

  _columnSpacing(containerWidth) {
    return Math.floor(this.columnWidth ||
      (this.columns && containerWidth / this.columns) ||
      this.widthAtIndex(0));
  }

  _columns(containerWidth) {
    const columnWidth = this._columnWidth(containerWidth);
    return Math.ceil(this.columns || containerWidth / columnWidth);
  }

  _initGrid(containerWidth) {
    this.grid = { width: containerWidth, columns: [] };
    this.cells = [];
    const columns = this._columns(containerWidth);
    for (let c = 0; c < columns; c++) {
      this.grid.columns[c] = [];
    }
  }

  _columnHeight(col) {
    const column = this.grid.columns[col];
    const last = column[column.length - 1];
    return (last && last.height) || 0;
  }

  _shortestColumn() {
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
  }

  _prepareGrid(containerWidth) {
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
  }

  flush(/* index, to */) {

  }

  isGrid(/*width*/) {
    return false;
  }

  visibleStartingIndex(topOffset, width, height) {
    topOffset = Math.min(topOffset, this.maxContentOffset(width, height));
    const columns = this._columns(width);
    return Math.floor(topOffset / this.heightAtIndex(0)) * columns;
  }

  numberVisibleWithin(topOffset, width, height, withPadding) {
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
  }

  position(index/*, width*/) {
    if (!this.cells || !this.cells[index]) {
      return { x: 0, y: 0 };
    }
    const cell = this.cells[index];
    return { x: cell.x, y: cell.y };
  }

  height(visibleWidth) {
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
  }

  widthAtIndex(index) {
    if (!this.cells || !this.cells[index]) {
      return 0;
    }
    return this.cells[index].width;
  }

  heightAtIndex(index) {
    if (!this.cells || !this.cells[index]) {
      return 0;
    }
    return this.cells[index].height;
  }

  length() {
    return this.cellCount();
  }
}
