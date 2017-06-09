var mainElement = document.getElementById('main')
if (mainElement) {
  var game = Life(mainElement)

  document.getElementById('step_btn')
  .addEventListener('click', game.step);
  document.getElementById('play_btn')
  .addEventListener('click', game.togglePlaying);
  document.getElementById('reset_btn')
  .addEventListener('click', game.random);
  document.getElementById('clear_btn')
  .addEventListener('click', game.clear);
    document.getElementById('preset_btn')
  .addEventListener('click', game.presetGlider);

}

function Life(container, width=12, height=12) {
  var present = new Board(width, height);
  var future = new Board(width, height);

  var table = createTable();
  var timer, playing = false;

  container.appendChild(table);

  table.addEventListener('mousedown', toggleCellFromEvent)

  function createTable() {
    // create <table> element
    var table = document.createElement('table');       // <table
    table.classList.add('board')                       //   class='board'>
    for (var r = 0; r < height; r++) {
      var tr = document.createElement('tr');           //   <tr>
      for (var c = 0; c < width; c++) {                //     For instance, at r=2, c=3:
        var td = document.createElement('td');         //     <td
        td.id = `${r}-${c}`;                            //       id="2-3">
        td.coord = [r, c];
        tr.appendChild(td);                            //     </td>
      }
      table.appendChild(tr);                           //   </tr>
    }                                                  //  </table>
    return table;
  }

  function toggleCellFromEvent(event) {
    var cell = document.getElementById(event.target.id);
    present.toggle(cell.coord);
    paint();
  }

  function paint() {
        var cells = table.getElementsByTagName('td');
    for (var i = 0; i < cells.length; i++){
      if (present.get(document.getElementById(cells[i].id).coord) === 1){
        cells[i].classList.remove('dead');
        cells[i].classList.add('alive');
      }
      else {
        cells[i].classList.remove('alive');
        cells[i].classList.add('dead');
      }
    }
  }

  function step() {
    [present, future] = tick(present, future);
    paint();
  }

  function play() {
    playing = true;
    timer = setInterval(step, 500);
  }

  function stop() {
    playing = false;
    clearInterval(timer);
  }

  function togglePlaying() {
    if (playing){
      stop();
   } else {
    play();
   }
  }

  function clear() {
    function everythingDies() { return false }
    [present, future] = tick(present, future, everythingDies);
    paint();
  }

  function random() {
    function randomize() {return (Math.floor(Math.random() * 2) === 1) ? true : false; }
    [present, future] = tick(present, future, randomize);
    paint();
  }

  function presetGlider() {
    function gliders(isAlive, numLivingNeighbor, i) {
      var arr = [1,  10, 14, 21, 24, 25, 26, 33, 34, 35, 108, 109, 110, 117, 118, 119, 122, 129, 133, 142];
      if (arr.includes(i)) return true;
      return false;
    }
    [present, future] = tick(present, future, gliders);
    paint();
  }

  return {play, step, stop, togglePlaying, random, clear, presetGlider};
}
