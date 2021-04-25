'use strict';

window.addEventListener("load", () => setTimeout( function (event) {
  const preloader = document.querySelector(".pre-loader");
  preloader.remove();
  main();
}, 0));

const gridHeight = 10;
const gridWidth = 20;
const cellSize = 50;
const pacSize = 36;
const pacSpeed = 3;

const game = document.querySelector('#game');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const pac1 = new Image();
pac1.src = './pacman_characters/pacman_closed.png';

const pac2 = new Image();
pac2.src = './pacman_characters/pacman_eating.png';

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

class Cell {
  static blockState = 0;
  static noneState = 1;
  static pointState = 2;
  static powerState = 3;
  
  #state;

  constructor(state) {
    this.#state = state;
  }

  get state() {
    return this.#state;
  }

  render() {
    const cell = document.createElement('div')
    cell.classList.add('cell')

    switch (this.#state) {
      
      case Cell.blockState:
        cell.classList.add('cell_block')
        break

      case Cell.pointState:
        let childPoint = document.createElement('div')
        childPoint.classList.add('point')
        cell.appendChild(childPoint)
        break

      case Cell.powerState:
        let child = document.createElement('div')
        child.classList.add('power')
        cell.appendChild(child)
        break
    }
    return cell
  }
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

  window.addEventListener('keydown', (event) => {
    dir = dirMap[event.key];
  });
  
  const grid = [];
  for (let i = 0; i < gridWidth; i++) {
    grid.push(Array(gridHeight).fill(new Cell(0)));
  }
  renderGrid(grid);
  readMap();

  requestAnimationFrame(animatePac);
}

function renderGrid(grid) {
  for (let col of grid) {
    const gridCol = document.createElement('div');
    gridCol.classList.add('row');
    for (let cell of col) {
      gridCol.appendChild(cell.render());
    }
    game.appendChild(gridCol);
  }
}

function animatePac() {
  renderPac();
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

function readMap() {
  
}