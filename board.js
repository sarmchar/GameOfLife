/**
 * Given a width and height, construct a Board.
 *
 * @param {Int} width
 * @param {Int} height
 * @param {Array<Int>} cells the array to use for the cells (default: new Uint8Array(width * height))
 */
function Board(width=32, height=32, cells) {
  this.width = width;
  this.height = height;
  // We'll store our cells in a 1D typed array.
  // Typed arrays are a lot like normal arrays, but they're
  // (1) much faster, and (2) can only hold one kind of data type.
  // In this case, we're creating a Uint8 typed array, which means
  // it can only hold unsigned, 8-bit integers (ints from 0 to 255).
  //
  // Since we only really need to track 1 bit per cell, this is positively
  // luxurious for our needs.
  this.cells = cells || new Uint8Array(width * height)
}

/**
 * indexFor(coords: [row: int, col: int]) -> int
 *
 * Given an array of coordinates [row, col], return the index of that cell in this
 * board's cells array.
 */
Board.prototype.indexFor = function([row, col]) {
  // OMG, a destructured parameter! ⬆️⬆️⬆️⬆️⬆️⬆️
  //
  // This digs into the array we were passed, plucks out the first
  // two elements, and names them row and col. Any other elements
  // are ignored.
  //
  // http://2ality.com/2015/01/es6-destructuring.html

  // Return undefined if we're out of bounds
  if (row < 0 || row >= this.height || col < 0 || col >= this.width)
    return;
  return row * this.width + col;
}

/**
 * get(coords: [row: int, col: int]) -> uint8
 *
 * Get the value of the board at coords.
 */
Board.prototype.get = function (coords) {
  return this.cells[this.indexFor(coords)] || 0;
};

/**
 * set(coords: [row: int, col: int], value: uint8)
 *
 * Set the value of the board at coords to value.
 */
Board.prototype.set = function(coords, value) {
  this.cells[this.indexFor(coords)] = value;
};

/**
 * livingNeighbors(coords: [row: int, col: int])
 *
 * Return the count of living neighbors around a given coordinate.
 */
Board.prototype.livingNeighbors = function([row, col]) {
   // TODO: Return the count of living neighbors.
  var count = 0;
  for (var i = row - 1; i < row + 2; i++){
    for (var j = col - 1; j < col + 2; j++){
      if (i >= 0 && j >= 0 && i < this.height && j < this.width){
        if (this.get([i, j])){
          count++;
        }
      }
    }
  }
  return count - this.get([row, col]);
};

/**
 * toggle(coords: [row: int, col: int])
 *
 * Toggle the cell at coords from alive to dead or vice versa.
 */
Board.prototype.toggle = function(coords) {
  this.cells[this.indexFor(coords)] = !this.get(coords);
};

/**
 * Give the vitals of a cell (its current state, and how many living neighbors it
 * currently has), return whether it will be alive in the next tick.
 *
 * @param {Boolean} isAlive
 * @param {Number} numLivingNeighbors
 */
function conway(isAlive, numLivingNeighbors) {
  if (isAlive){
    if (numLivingNeighbors < 2 || numLivingNeighbors > 3) return false;
    return true;
  } else {
    if (numLivingNeighbors === 3) return true;
    return false;
  }
}

/**
 * Given a present board, a future board, and a rule set, apply
 * the rules to the present and modify the future.
 *
 * @param {Board} present
 * @param {Board!} future (is mutated)
 * @param {(Boolean, Int) -> Boolean} rules (default: conway)
 */
function tick(present, future, rules = conway) {
  for (var i = 0; i < present.cells.length; i++){
    var [row, col] = [Math.floor(i / present.width), i % present.width];
    if (rules(present.get([row, col]), present.livingNeighbors([row, col]))){
      future.set([row, col], 1);
    }
    else {
      future.set([row, col], 0);
    }
  }
  return [future, present];
}
