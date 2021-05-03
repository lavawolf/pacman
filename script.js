'use strict';

const map1 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 3, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 3, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 0, 2, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 1, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 0, 1, 1, 1, 0, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0],
  [0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0],
  [0, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]

const map = map1;
const gridHeight = map.length;
const gridWidth = map[0].length;
const cellSize = 40;
const pacSize = 26;

const ghostSize = 40;
const line_margin = 7;
const pacSpeed = 3;
const ghostSpeed = 2;

const game = document.querySelector('#game');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scoreboard = document.querySelector('#scoreboard');
const scoreDisplay = document.querySelector('#score');

const pac1 = new Image();
pac1.src = './pacman_characters/pacman_closed.png';
const pac2 = new Image();
pac2.src = './pacman_characters/pacman_eating.png';

// initializes the ghost object
class Ghost{
  constructor(Name, start, speed, image) {
    this.className = Name;
    this.startPosition = start;
    this.currentPosition_x = start[0];
    this.currentPosition_y = start[1];
    this.speed = speed;
    this.image = image;
    this.direction = NaN;
  }
}

// Ghost images
const ghost_red = new Image();
ghost_red.src = './pacman_characters/red_ghost.png';
const ghost_orange = new Image();
ghost_orange.src = './pacman_characters/orange_ghost.png';
const ghost_pink = new Image();
ghost_pink.src = './pacman_characters/pink_ghost.png';
const ghost_blue = new Image();
ghost_blue.src = './pacman_characters/blue_ghost.png';
const ghost_scared = new Image();
ghost_scared.src = './pacman_characters/scared_ghost.png';

// initialising the ghosts with name, initial coordinates, speed, and image src
const ghosts = [
  new Ghost('red', [420, 380], 2.5, ghost_red), 
  new Ghost('pink', [420, 420], 3, ghost_pink), 
  new Ghost('blue', [460, 420], 2.5, ghost_blue), 
  new Ghost('orange', [380, 420], 3, ghost_orange) ];


// defines the state of each cell
const stateMap = {
  blockState: 0,
  noneState: 1,
  pointState: 2,
  powerState: 3,
}

// defines the input key by the user
const dirMap = {
  "ArrowLeft": 2,
  "ArrowRight": 0,
  "ArrowUp": 1,
  "ArrowDown": 3,
}

const scoreMap = {
  2: 10,
  3: 50,
}

const grid = [];

let state = 0;
let x = 60;
let y = 60;
let dir = 4;
let x_grid = 1;
let y_grid = 1;
let queryTicks = 0;
let queryDir = 0;
let score = 0;


function renderCell(state, adj) {
  const cell = document.createElement('div');
  cell.classList.add('cell');

  switch (state) {
    case stateMap.blockState:
      cell.classList.add('cell_block');
      if (adj.left) cell.style.borderLeft = '1px solid blue';
      if (adj.right) cell.style.borderRight = '1px solid blue';
      if (adj.top) cell.style.borderTop = '1px solid blue';
      if (adj.bottom) cell.style.borderBottom = '1px solid blue';
      break

    case stateMap.pointState:
      let childPoint = document.createElement('div');
      childPoint.classList.add('point');
      cell.appendChild(childPoint);
      break

    case stateMap.powerState:
      let child = document.createElement('div');
      child.classList.add('power');
      cell.appendChild(child);
      break;
    }
    return cell;
}


function eatCell() {
  const cell = grid[x_grid][y_grid];
  if(cell.children.length) {
    cell.removeChild(cell.lastChild);
    score += scoreMap[map[y_grid][x_grid]];
  }
  scoreDisplay.textContent = score;
  // console.log(score);
}


function turn() {
  if ((dir + queryDir) % 2 == 0) {
    dir = queryDir;
    queryTicks = 0;
  } else if (queryDir % 2 === 1 && Math.abs(x - (x_grid + 1/2) * cellSize) <= 4) {
    if(map[y_grid + queryDir - 2][x_grid]) {
      x = (x_grid + 1/2) * cellSize;
      dir = queryDir;
    }
    queryTicks = 0;
  } else if(queryDir % 2 === 0 && Math.abs(y - (y_grid + 1/2) * cellSize) <= 4) {
    if(map[y_grid][x_grid + 1 - queryDir]){
      y = (y_grid + 1/2) * cellSize;
      dir = queryDir;
    }
    queryTicks = 0;
  } else queryTicks--;
  eatCell();
}


function main() {
  const h = gridHeight * cellSize;
  const w = gridWidth * cellSize;
  game.style.height = `${h}px`;
  game.style.width = `${w}px`;
  canvas.style.height = game.style.height;
  canvas.style.width = game.style.width;
  ctx.canvas.height = h;
  ctx.canvas.width = w;
  scoreboard.style.height = game.style.height;
  game.style.border = '2px solid blue';


  window.addEventListener('keydown', (event) => {
    event.preventDefault();
    queryDir = dirMap[event.key];
    queryTicks = Math.floor(cellSize / pacSpeed);
  });
  

  for (let xc = 0; xc < gridWidth; xc++) {
    const col = [];
    for (let yc = 0; yc < gridHeight; yc++) {
      const adj = {};
      if(xc > 0 && map[yc][xc-1] > 0) adj.left = true;
      if(xc < gridWidth - 1 && map[yc][xc+1] > 0) adj.right = true;
      if(yc > 0 && map[yc-1][xc] > 0) adj.top = true;
      if(yc < gridHeight - 1 && map[yc+1][xc] > 0) adj.bottom = true;
      col.push(renderCell(map[yc][xc], adj));
    }
    grid.push(col);
  }

  renderGrid();

  requestAnimationFrame(animatePac);
}


// returns valid moving cells from adjacent cells
function getPossible(x, y) {
  let allowed = {'left': [x - 1, y],
                'right': [x + 1, y], 
                'up': [x, y - 1], 
                'down': [x, y + 1]};
  for (var k of Object.keys(allowed)) {
    let i = allowed[k];
    if (map[i[1]][i[0]] === 0) delete allowed[k];
  }
  return allowed;
}

function renderRed() {
  ctx.drawImage(ghosts[1], x_r - ghostSize/2, y_r - ghostSize/2, ghostSize, ghostSize);
  let x_pos = Math.floor((x_r - cellSize/2 )/ cellSize);
  let y_pos = Math.floor((y_r - cellSize/2 )/ cellSize);
  let moves = getPossible(x_pos, y_pos);    // finds possible moves
}


function renderGhost() {
  ghosts.forEach(ghost => {
    ctx.drawImage(ghost.image, ghost.currentPosition_x  - 20, ghost.currentPosition_y - 20, ghostSize, ghostSize);
  })

  ghosts.forEach(ghost => {

    // finds the cell index of the ghost (x_pos, y_pos)
    let x_pos = Math.floor(ghost.currentPosition_x / cellSize);
    let y_pos = Math.floor(ghost.currentPosition_y / cellSize);
        
    console.log(ghost.currentPosition_x % cellSize) <= ((cellSize / 2) + 1);

    // if condition to check if the ghost is near the center or not
    if ( isNaN(ghost.direction) || (
      (ghost.currentPosition_x % cellSize) <= ((cellSize / 2) + 1) && 
      (ghost.currentPosition_x % cellSize) >= ((cellSize / 2) - 1) &&
      (ghost.currentPosition_y % cellSize) <= ((cellSize / 2) - 1) && 
      (ghost.currentPosition_y % cellSize) >= ((cellSize / 2) + 1)) ) {
        
        console.log('hi');
      ghost.currentPosition_x = (x_pos * cellSize) + (cellSize / 2);
      ghost.currentPosition_y = (y_pos * cellSize) + (cellSize / 2);

      let moves = getPossible(x_pos, y_pos);  // finds all possible moves

      let move = moves[Math.floor(Math.random() * moves.length)];   //selects a random move

      ghost.direction = Object.keys(move)[0];   // updates the direction of the ghost

      switch (ghost.direction) {
        case 'left': 
          ghost.currentPosition_x -= ghost.speed;
          break;
        case 'right':  
          ghost.currentPosition_x += ghost.speed;
          break;
        case 'up': 
          ghost.currentPosition_y -= ghost.speed;
          break;
        case 'down': 
          ghost.currentPosition_y += ghost.speed;
          break;
      }

    //   if (ghost == ghosts[0]) {
    //   }
    //   else if (ghost == ghosts[1]) {
    //   }
    //   else if (ghost == ghosts[2]) {
    //   }
    //   else {
    //   }

    // }
    }

    else {

      switch (ghost.direction) {
        case 'left': 
          ghost.currentPosition_x -= ghost.speed;
          break;
        case 'right':  
          ghost.currentPosition_x += ghost.speed;
          break;
        case 'up': 
          ghost.currentPosition_y -= ghost.speed;
          break;
        case 'down': 
          ghost.currentPosition_y += ghost.speed;
          break;
      }
    }
  } )

}


function renderGrid() {
  for (let col of grid) {
    const gridCol = document.createElement('div');
    gridCol.classList.add('row');
    for (let cell of col) {
      gridCol.appendChild(cell);
    }
    game.appendChild(gridCol);
  }
}


function animatePac() {
  
  renderPac();
  renderGhost();
  state = (state + 1) % 20;
  if (queryTicks > 0) turn();
  switch (dir) {
    case 0:
      x += pacSpeed;
      x_grid = Math.floor((x - cellSize / 2) / cellSize);
      if (!map[y_grid][x_grid + 1]) x = (x_grid + 1/2) * cellSize;
      x_grid = Math.floor((x - cellSize / 2) / cellSize);
      break;
    case 1:
      y -= pacSpeed;
      y_grid = Math.floor((y - cellSize / 2) / cellSize);
      if (!map[y_grid][x_grid]) y = (y_grid + 3/2) * cellSize;
      y_grid = Math.floor((y - cellSize / 2) / cellSize);
      break;
    case 2:
      x -= pacSpeed;
      x_grid = Math.floor((x - cellSize / 2) / cellSize);
      if (!map[y_grid][x_grid]) x = (x_grid + 3/2) * cellSize;
      x_grid = Math.floor((x - cellSize / 2) / cellSize);
      break;
    case 3:
      y += pacSpeed;
      y_grid = Math.floor((y - cellSize / 2) / cellSize);
      if (!map[y_grid + 1][x_grid]) y = (y_grid + 1/2) * cellSize;
      y_grid = Math.floor((y - cellSize / 2) / cellSize);
      break;
  }
  if ((x - cellSize / 2) % cellSize <= pacSpeed && (y - cellSize / 2) % cellSize <= pacSpeed) eatCell(grid[x_grid][y_grid]);
  
  // if(dir === 0 || dir === 3) eatCell(grid[x_grid][y_grid]);
  // else if(dir === 2) eatCell(grid[x_grid + 1][y_grid]);
  // else eatCell(grid[x_grid][y_grid + 1]);
  requestAnimationFrame(animatePac);
}


function renderPac() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI * dir / 2);
  if (state > 10) {
    ctx.drawImage(pac1, -pacSize / 2, -pacSize / 2, pacSize, pacSize);
  } else {
    ctx.drawImage(pac2, -pacSize / 2, -pacSize / 2, pacSize, pacSize);
  }
  ctx.rotate(Math.PI * dir / 2);
  ctx.translate(-x, -y);
  // ctx.restore();
}


function init() {
  window.addEventListener("load", () => setTimeout( function (event) {
    const preloader = document.querySelector("#pre");
    preloader.classList.add("finish-load");
    main();
  }, 0));
}

init();