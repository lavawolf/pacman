'use strict';

const map1 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 3, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 3, 2, 2, 0],
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

window.addEventListener("load", () => setTimeout( function (event) {
  const preloader = document.querySelector("#pre");
  preloader.classList.add("finish-load");
  main();
}, 0));

const map = map1;
const gridHeight = map.length;
const gridWidth = map[0].length;
const cellSize = 40;
const pacSize = 26;
const ghostSize = 26;
const line_margin = 7;
const pacSpeed = 3;

const game = document.querySelector('#game');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const pac1 = new Image();
pac1.src = './pacman_characters/pacman_closed.png';
const pac2 = new Image();
pac2.src = './pacman_characters/pacman_eating.png';

var ghosts = [];
const ghost_green = new Image();
ghost_green.src = './pacman_characters/green_ghost.png';
const ghost_red = new Image();
ghost_red.src = './pacman_characters/red_ghost.png';
const ghost_orange = new Image();
ghost_orange.src = './pacman_characters/orange_ghost.png';
const ghost_pink = new Image();
ghost_pink.src = './pacman_characters/pink_ghost.png';
const ghost_scared = new Image();
ghost_scared.src = './pacman_characters/scared_ghost.png';
ghosts.push(ghost_scared);
ghosts.push(ghost_green);
ghosts.push(ghost_orange);
ghosts.push(ghost_red);
ghosts.push(ghost_pink);


const stateMap = {
  blockState: 0,
  noneState: 1,
  pointState: 2,
  powerState: 3,
}

const dirMap = {
  "ArrowLeft": 2,
  "ArrowRight": 0,
  "ArrowUp": 1,
  "ArrowDown": 3,
}

let state = 0;
let x = 275;
let y = 25;
let dir = 0;
let x_grid = 0;
let y_grid = 0;

function renderCell(state, adj) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  

  switch (state) {
    case stateMap.blockState:
      console.log(adj);
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


function eatCell(cell) {
  cell.removeChild(cell.lastChild);
}


function main() {
  console.log(map);
  const h = gridHeight * cellSize;
  const w = gridWidth * cellSize;
  game.style.height = `${h}px`;
  game.style.width = `${w}px`;
  canvas.style.height = game.style.height;
  canvas.style.width = game.style.width;
  ctx.canvas.height = h;
  ctx.canvas.width = w;

  window.addEventListener('keydown', (event) => {
    dir = dirMap[event.key];
  });
  
  const grid = [];
  for (let x = 0; x < gridWidth; x++) {
    const col = [];
    for (let y = 0; y < gridHeight; y++) {
      const adj = {};
      if(x > 0 && map[y][x-1] > 0) adj.left = true;
      if(x < gridWidth - 1 && map[y][x+1] > 0) adj.right = true;
      if(y > 0 && map[y-1][x] > 0) adj.top = true;
      if(y < gridHeight - 1 && map[y+1][x] > 0) adj.bottom = true;
      col.push(renderCell(map[y][x], adj));
    }
    grid.push(col);
  }
  renderGrid(grid);
  // eatCell(grid[1][2]);
  requestAnimationFrame(animatePac);

  // renderGhost(map1);
}

function renderGhost() {
  let i = 1;
  for (let [col_ind, col_val] of map1.entries()) {
    for (let [cell_ind, cell_val] of col_val.entries()) {
      if ( cell_val === stateMap.noneState) {
        ctx.drawImage(ghosts[i], cell_ind * cellSize + (line_margin), col_ind * cellSize + (line_margin), ghostSize, ghostSize);
        i += 1;
      }
    }
  }
}

function renderGrid(grid) {
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
  
  switch (dir) {
    case 0:
      x += pacSpeed;
      break;
    case 1:
      y -= pacSpeed;
      break;
    case 2:
      x -= pacSpeed;
      break;
    case 3:
      y += pacSpeed;
      break;
  }
  x_grid = Math.floor((x - cellSize / 2) / cellSize);
  y_grid = Math.floor((y - cellSize / 2) / cellSize);
  // console.log(x);
  if (x_grid < 0) x = cellSize / 2;
  else if (x_grid >= gridWidth - 1) x = (gridWidth - 1/2) * cellSize;
  
  if (y_grid < 0) y = cellSize / 2;
  else if (y_grid >= gridHeight - 1) y = (gridHeight - 1/2) * cellSize;
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


