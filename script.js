'use strict';

window.addEventListener("load", () => setTimeout( function (event) {
  const preloader = document.querySelector(".pre-loader");
  preloader.classList.add("finish-load");
}, 4400));

const gridHeight = 10
const gridWidth = 20

const game = document.querySelector('#game')
const canvas = document.querySelector('canvas')


class Cell {
  static blockState = 0
  static noneState = 1
  static pointState = 2
  static powerState = 3
  
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
    console.log(Cell.blockState)

    switch (this.#state) {
      
      case Cell.blockState:
        console.log('e')
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
  game.style.height = `${gridHeight * 40 + 20}px`
  game.style.width = `${gridWidth * 40 + 40}px`
  canvas.style.height = game.style.height
  canvas.style.width = game.style.width
  const grid = []
  for (let i = 0; i < gridWidth; i++) {
    grid.push(Array(gridHeight).fill(new Cell(0)))
  }
  render(grid)
}

function render(grid) {
  for (let col of grid) {
    const gridCol = document.createElement('div')
    gridCol.classList.add('row')
    for (let cell of col) {
      gridCol.appendChild(cell.render())
    }
    game.appendChild(gridCol)
  }
}


main()

