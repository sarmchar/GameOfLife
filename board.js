function Board(width = 32, height = 32, cells) {
  this.width = width;
  this.height = height;
  this.cells = cells || new Uint8Array(width * height);
}

Board.prototype.indexFor = function([row, col]) {
  if (row < 0 || row >= this.height || col < 0 || col >= this.width) return;
  return row * this.width + col;
};

Board.prototype.get = function (coords) {
  return this.cells[this.indexFor(coords)] || 0;
};

Board.prototype.set = function(coords, value) {
  this.cells[this.indexFor(coords)] = value;
};

Board.prototype.livingNeighbors = function([row, col]) {
  var count = 0;
  for (var i = row - 1; i < row + 2; i++){
    for (var j = col - 1; j < col + 2; j++){
      if (i >= 0 && j >= 0 && i < this.height && j < this.width){
        count += this.get([i, j]);
      }
    }
  }
  return count - this.get([row, col]);
};

Board.prototype.toggle = function(coords) {
  this.cells[this.indexFor(coords)] = !this.get(coords);
};

function conway(isAlive, numLivingNeighbors) {
  if (isAlive){
    if (numLivingNeighbors < 2 || numLivingNeighbors > 3) return false;
    return true;
  } else {
    if (numLivingNeighbors === 3) return true;
    return false;
  }
}


function tick(present, future, rules = conway) {
  for (var i = 0; i < present.cells.length; i++){
    var [row, col] = [Math.floor(i / present.width), i % present.width];
    if (rules(present.get([row, col]), present.livingNeighbors([row, col]), i)){
      future.set([row, col], 1);
    }
    else {
      future.set([row, col], 0);
    }
  }
  return [future, present];
}
