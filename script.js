'use strict';

const gridWidth = 50
const gridHeight = 40

const game = document.querySelector('#game')

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
        childPoint.classList.add('cell_point')
        cell.appendChild(childPoint)
        break

      case Cell.powerState:
        let child = document.createElement('div')
        child.classList.add('cell_power')
        cell.appendChild(child)
        break
    }
    return cell
  }
}




function main() {
  const grid = []
  for (let i = 0; i < gridHeight; i++) {
    grid.push(Array(gridWidth).fill(new Cell(0)))
  }
  console.log(grid[4][5].state)
  game.appendChild(grid[4][5].render())
}

function render(grid) {
  
}


main()

