'use strict';

const map1 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 1, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 0, 1, 1, 1, 0, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0],
  [0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
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
const pacSpeed = 4;

const game = document.querySelector('#game');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const pac1 = new Image();
pac1.src = './pacman_characters/pacman_closed.png';
const pac2 = new Image();
pac2.src = './pacman_characters/pacman_eating.png';

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
let x = 60;
let y = 60;
let dir = 0;
let x_grid = 1;
let y_grid = 1;
let queryTicks = 0;
let queryDir = 0;

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


function eatCell(cell) {
  cell.removeChild(cell.lastChild);
}


function turn() {
  if ((dir + queryDir) % 2 == 0) {
    dir = queryDir;
    queryTicks = 0;
  } else if (queryDir % 2 === 1 && Math.abs(x - (x_grid + 1/2) * cellSize) <= 4) {
    x = (x_grid + 1/2) * cellSize;
    dir = queryDir;
    queryTicks = 0;
  } else if(queryDir % 2 === 0 && Math.abs(y - (y_grid + 1/2) * cellSize) <= 4) {
    y = (y_grid + 1/2) * cellSize;
    dir = queryDir;
    queryTicks = 0;
  } else queryTicks--;
}


function main() {
  // console.log(map);
  const h = gridHeight * cellSize;
  const w = gridWidth * cellSize;
  game.style.height = `${h}px`;
  game.style.width = `${w}px`;
  canvas.style.height = game.style.height;
  canvas.style.width = game.style.width;
  ctx.canvas.height = h;
  ctx.canvas.width = w;

  window.addEventListener('keydown', (event) => {
    queryDir = dirMap[event.key];
    queryTicks = 10;
  });
  
  const grid = [];
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
  renderGrid(grid);
  // eatCell(grid[1][2]);
  requestAnimationFrame(animatePac);
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
  state = (state + 1) % 20;
  // console.log(x, y, dir);
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


