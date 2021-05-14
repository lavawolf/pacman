'use strict';

const map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 0, 3, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 1, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 0, 2, 0, 1, 1, 1, 0, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 0],
  [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0],
  [0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0],
  [0, 2, 3, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0],
  [0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]

// const map = map1;
const gridHeight = map.length;
const gridWidth = map[0].length;
const cellSize = 40;
const pacSize = 26;

const ghostSize = 30;
const pacSpeed = 3;
const ghostSpeed = 2;

const root = document.documentElement;
const game = document.querySelector('#game');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scoreboard = document.querySelector('#scoreboard');
const scoreDisplay = document.querySelector('#score');
const levelDisplay = document.querySelector('#level');
const livesDisplay = document.querySelector('#lives');
const highScoreDisplay = document.querySelector('#highscore');
const instruction = document.createElement('div');
instruction.id = 'instruction';
instruction.style.color = 'yellow';
instruction.textContent = 'Press any key to start';

const pac1 = new Image();
pac1.src = './pacman_characters/pacman_closed.png';
const pac2 = new Image();
pac2.src = './pacman_characters/pacman_eating.png';

// initializes the ghost object
class Ghost{
  constructor(Name, start, number, image) {
    this.className = Name;
    this.startPosition_x = start[0];
    this.startPosition_y = start[1];
    this.currentPosition_x = start[0];
    this.currentPosition_y = start[1];
    this.speed = ghost_speeds[number];
    this.image = image;
    this.direction = NaN;
    this.directionRev = NaN;
    this.IsScared = false;
    this.isDead = false;
    this.hasLeftHouse = false; //to check if ghost has left the house
  }
}

const dirRev = {'left': 'right', 'right': 'left', 'up': 'down', 'down': 'up'}

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
const ghost_scared_white = new Image();
ghost_scared_white.src = 'pacman_characters/ghost_scared_white.png';

let level = 1.0;
const ghost_images = [ghost_red, ghost_pink, ghost_blue, ghost_orange, ghost_scared, ghost_scared_white];
let ghost_speeds = [2.2, 2.4, 2.8, 3.0];


// initialising the ghosts with name, initial coordinates, speed, and image src
let ghosts = [
  new Ghost('red', [420, 380], 0, ghost_red), 
  new Ghost('pink', [420, 420], 1, ghost_pink), 
  new Ghost('blue', [460, 420], 2, ghost_blue), 
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
let totalPoints = 0;
let powerTime = 0;
let ghostsEaten = 0;
let pacmanMoving = false;
let restartGame = false;
let instr_removed = false;

let score = 0;
let highScore = 0;
let lives = 3;


function renderCell(state, adj) {
  const cell = document.createElement('div');
  cell.classList.add('cell');

  switch (state) {
    case stateMap.blockState:
      cell.classList.add('cell_block');
      if (adj.left) cell.style.borderLeft = '2px solid blue';
      if (adj.right) cell.style.borderRight = '2px solid blue';
      if (adj.top) cell.style.borderTop = '2px solid blue';
      if (adj.bottom) cell.style.borderBottom = '2px solid blue';
      break;

    case stateMap.pointState:
      let childPoint = document.createElement('div');
      childPoint.classList.add('point');
      cell.appendChild(childPoint);
      totalPoints++;
      break;

    case stateMap.powerState:
      let child = document.createElement('div');
      child.classList.add('power');
      cell.appendChild(child);
      totalPoints++;
      break;
    }
    return cell;
}


const eatPoint = new Audio();
eatPoint.src = './sounds/eatPoint.wav';
const death = new Audio();
death.src = './sounds/Death.mp3';
const powerPill = new Audio();
powerPill.src = './sounds/eat_powerpill.mp3';
const intro_music = new Audio;
intro_music.src = './sounds/intro-music.mp3';
const power_audio = new Audio;
power_audio.src = './sounds/power_is_active.wav';
const eat_ghost = new Audio;
eat_ghost.src = './sounds/eat_ghost.wav';
const ghost_retreat = new Audio;
ghost_retreat.src = './sounds/ghost_retreating.wav';


function playSound(audio, rate = 1.15) {
  const sound = audio;
  if (sound != intro_music) sound.playbackRate = rate;
  sound.play();
}

function eatCell() {
  const cell = grid[x_grid][y_grid];
  if(cell.children.length) {
    cell.removeChild(cell.lastChild);
    score += scoreMap[map[y_grid][x_grid]];
    playSound(eatPoint);
    totalPoints--;
    if (map[y_grid][x_grid] === stateMap.powerState) {
      powerTime = 60*7;
      playSound(powerPill);
      ghostsEaten = 0;
      ghosts.forEach( ghost => {
        ghost.isDead = false;
      })
    }
    if(totalPoints === 0) restart();
  }
  scoreDisplay.textContent = 'Score ' + score;
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
  scoreboard.style.visibility = 'visible';
  document.querySelector('#title').style.visibility = 'visible';
  root.style.setProperty('--scale', Math.min(window.innerWidth / 1473, window.innerHeight / 952));
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
  levelDisplay.textContent = 'Level ' + level;

  scoreboard.appendChild(instruction);
  let blehbleh = document.createElement('img');
  blehbleh.src = pac2.src;
  blehbleh.style.visibility = 'hidden';
  blehbleh.style.width = '0.1px';
  livesDisplay.appendChild(blehbleh);

  for(let i = 0; i < lives; i++) {
    let temp = document.createElement('img')
    temp.src = pac2.src;
    livesDisplay.appendChild(temp);
  }

  window.addEventListener('keydown', (event) => {
    pacmanMoving = true;
    event.preventDefault();
    queryDir = dirMap[event.key];
    queryTicks = Math.floor(cellSize / pacSpeed);
  });

  window.addEventListener('resize', () => root.style.setProperty('--scale', Math.min(window.innerWidth / 1441, window.innerHeight / 952)));
  
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

// returns valid cells to move from the adjacent cells of the current cell
function getPossible(x, y, ghost) {
  let allowed = {'left': [x - 1, y],
                'right': [x + 1, y], 
                'up': [x, y - 1], 
                'down': [x, y + 1]};
  for (var k of Object.keys(allowed)) {
    let i = allowed[k];
    if (map[i[1]][i[0]] === 0) delete allowed[k];
    if (ghost.hasLeftHouse) {
      if (i[1] == 9 && i[0] == 10) delete allowed[k];
    }
  }
  return allowed;
}

// Moves the ghost in the direction it is already moviing in
function NextMove(ghost) {
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

// function to decrease life of pacman or call the end of game
function IsEaten(ghost) {

  if (JSON.stringify(ghost.currentPosition_x) >= x - 7 && JSON.stringify(ghost.currentPosition_x) <= x + 7 &&
      JSON.stringify(ghost.currentPosition_y) >= y - 7 && JSON.stringify(ghost.currentPosition_y) <= y + 7){
    
    // ghost is scared, pacman lives, ghost is reinitialized
    if (ghost.IsScared){
      playSound(eat_ghost);
      playSound(ghost_retreat);
      ghost.currentPosition_x = ghost.startPosition_x;
      ghost.currentPosition_y = ghost.startPosition_y;
      ghost.hasLeftHouse = false;
      ghost.isDead = true;
      score += 200 * ( 2**ghostsEaten);
      ghostsEaten++;
    }

    // ghosts are not scared pacman dies
    else {
      lives--;
      playSound(death);
      powerTime = 0;

      livesDisplay.removeChild(livesDisplay.lastChild);

      //reinitialize ghosts and pacman positions
      ghosts.forEach( ghostNew => {
        ghostNew.currentPosition_x = ghostNew.startPosition_x;
        ghostNew.currentPosition_y = ghostNew.startPosition_y;
        ghostNew.hasLeftHouse = false;
      } )
      PacReset();
    }
    return true;
  }
  return false;
}

// sets direction and directionRev for ghost if at starting position
function setDirection (ghost) {
  switch (ghost.className) {
    case 'red':
      ghost.direction = 'up';
      ghost.directionRev = dirRev['up'];
      break;
    case 'pink':
      ghost.direction = 'up';
      ghost.directionRev = dirRev['up'];
      break;
    case 'blue':
      ghost.direction = 'left';
      ghost.directionRev = dirRev['left'];
      break;
    case 'orange':
      ghost.direction = 'right';
      ghost.directionRev = dirRev['right'];
      break;
  }
}

// moving the ghosts
function MoveGhosts() {
  ghosts.forEach(ghost => {

    // checks if pacman has eaten ghost
    if (IsEaten(ghost)) return;
    
    // orange ghost exits at 120 points
    if (ghost.className == 'orange') {
      if (score < 120) return;
    }

    // blue ghost exits at 80 points
    if (ghost.className == 'blue'){
      if (score < 80) return;
    }

    // assign direction to ghost if ghost is at starting point
    if ( JSON.stringify(ghost.startPosition_x) == JSON.stringify(ghost.currentPosition_x) && 
      JSON.stringify(ghost.startPosition_y) == JSON.stringify(ghost.currentPosition_y) ){
      setDirection(ghost);
    }

    // find x, y coordinates of the ghost in the grid
    let x_pos = Math.floor(ghost.currentPosition_x / cellSize);
    let y_pos = Math.floor(ghost.currentPosition_y / cellSize);

    //find all possible moves for the ghost
    let moves = getPossible(x_pos, y_pos, ghost);

    // checks if ghost has left house so that it may not enter again
    if (x_pos == 10 && y_pos == 8) ghost.hasLeftHouse = true; 

    // condition to check if the ghost is near the center of the cell or not
    if ( ((cellSize / 2) - ghost.speed / 2) <= (ghost.currentPosition_x - (x_pos * cellSize)) && (ghost.currentPosition_x - (x_pos * cellSize)) <= ((cellSize / 2) + ghost.speed / 2) && 
       ((cellSize / 2) - ghost.speed / 2) <= (ghost.currentPosition_y - (y_pos * cellSize)) && (ghost.currentPosition_y - (y_pos * cellSize)) <= ((cellSize / 2) + ghost.speed / 2) ) {
      
      // resets ghost to center of the cell
      ghost.currentPosition_x = (x_pos * cellSize) + (cellSize / 2);
      ghost.currentPosition_y = (y_pos * cellSize) + (cellSize / 2);

      // removes reverse direction to avoid ghost going back
      if ( moves.hasOwnProperty(ghost.directionRev) ) delete moves[ghost.directionRev];

      //selects a random move and updates the direction of the ghost if it is at the end of line
      ghost.direction = Object.keys(moves)[Math.floor(Math.random() * Object.keys(moves).length)]; 
      ghost.directionRev = dirRev[ghost.direction];
      
      // moves the ghost by one step
      NextMove(ghost);
    }

    else NextMove(ghost);
  } )

}

function renderGhost() {
  let ghost_no = 0;

  // drawing the ghosts
  ghosts.forEach(ghost => {

    //checks if ghost is scared
    if (powerTime > 0 && !ghost.isDead) ghost.IsScared = true;
    else ghost.IsScared = false;

    // changes speed and image of the ghost
    if (ghost.IsScared) {
      if (powerTime <= 180 && (powerTime % 50 <= 15)) ghost.image = ghost_scared_white;
      else ghost.image = ghost_scared;
      ghost.speed = (ghost_speeds[ghost_no] + (ghost.speed/5) * (level - 1.0)) / 1.40;
    }
    else {
      ghost.image = ghost_images[ghost_no];
      ghost.speed = ghost_speeds[ghost_no] + (ghost.speed/5) * (level - 1.0);
    }
    ctx.drawImage(ghost.image, ghost.currentPosition_x  - ghostSize / 2, ghost.currentPosition_y - ghostSize / 2, ghostSize, ghostSize);
    ghost_no++;
  })

  // if pacman hasn't started, ghosts don't move
  if (!pacmanMoving) return;
  else {
    if (!instr_removed) {
      scoreboard.removeChild(instruction);
      instr_removed = true;
    }
    MoveGhosts();
  }
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
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  renderGhost();
  renderPac();
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
  if ((x - cellSize / 2) % cellSize <= pacSpeed && (y - cellSize / 2) % cellSize <= pacSpeed) {
    eatCell(grid[x_grid][y_grid]);
  }

  if (powerTime > 0) {
    powerTime --;
    playSound(power_audio);
  }
  else {
    ghostsEaten = 0;
    ghosts.forEach(ghost => {
      ghost.isDead = false;
    })
  }

  // Asks user to start a new game
  if (lives === 0 && !restartGame) {
    newGame();
    restartGame = true;
  }
  if (lives != 0) requestAnimationFrame(animatePac);
}

function renderPac() {
  ctx.translate(x, y);
  ctx.rotate(-Math.PI * dir / 2);
  if (state > 10) {
    ctx.drawImage(pac1, -pacSize / 2, -pacSize / 2, pacSize, pacSize);
  } else {
    ctx.drawImage(pac2, -pacSize / 2, -pacSize / 2, pacSize, pacSize);
  }
  ctx.rotate(Math.PI * dir / 2);
  ctx.translate(-x, -y);
}

function PacReset() {
  state = 0;
  if (lives != 0) {
    x = 60;
    y = 60;
  }
  dir = 4;
  x_grid = 1;
  y_grid = 1;
  queryTicks = 0;
  queryDir = 0;
  pacmanMoving = false;
  if (lives !== 0) {
    instr_removed = false;
    scoreboard.appendChild(instruction);
  }
}

function newGame() {
  let tempbutton = document.createElement('button');
  scoreboard.appendChild(tempbutton);
  tempbutton.classList.add('start_button');
  tempbutton.textContent = 'PlAy aGaIn';
  tempbutton.style.height = '8%';
  tempbutton.style.width = '15%';
  tempbutton.style.fontSize = '100%';
  tempbutton.addEventListener('click', function (){
    tempbutton.remove();
    requestAnimationFrame(animatePac);
    restart();
  })
}

function restart() {
  totalPoints = 0;
  for(let x = 0; x < grid.length; x++) {
    for(let y = 0; y < grid[0].length; y++) {
      const cell = grid[x][y]
      if(map[y][x] === stateMap.pointState) {
        let childPoint = document.createElement('div');
        childPoint.classList.add('point');
        if(!cell.lastChild) cell.appendChild(childPoint);
        totalPoints++;
      }
      else if (map[y][x] === stateMap.powerState){
        let child = document.createElement('div');
        child.classList.add('power');
        if(!cell.lastChild) cell.appendChild(child);
        totalPoints++;
      }
    }
  }
  ghosts.forEach( ghostNew => {
    ghostNew.currentPosition_x = ghostNew.startPosition_x;
    ghostNew.currentPosition_y = ghostNew.startPosition_y;
    ghostNew.hasLeftHouse = false;
  } )

  if (restartGame) {
    level = 1.0;
    highScore = Math.max(score, highScore);
    highScoreDisplay.textContent = 'High Score ' + highScore;
    score = 0;
    restartGame = false;
  }
  else level+=1.0;
  
  // updating lives display
  for(let i = 0; i < lives; i++) {
    livesDisplay.removeChild(livesDisplay.lastChild);
  }
  lives = 3;
  for(let i = 0; i < lives; i++) {
    let temp = document.createElement('img')
    temp.src = pac2.src;
    livesDisplay.appendChild(temp);
  }

  powerTime = 0;
  levelDisplay.textContent = 'Level ' + level;
  PacReset();
}

function startWebpage () {  
  var gif = document.createElement('img');
  gif.classList.add('pacman');
  gif.src = "pacman_characters/pacman_animation.gif";
  var h1 = document.createElement('h1');
  h1.textContent = "PA1MAN";
  h1.classList.add("title-preload");
  document.querySelector('body').appendChild(h1);
  const preloader = document.querySelector("#pre");
  preloader.appendChild(h1);
  preloader.appendChild(gif);

  // playSound(intro_music, 1);
  setTimeout( function (event) {
    const preloader = document.querySelector("#pre");
    preloader.classList.add("finish-load");
    main();
  }, 200);
} 

function init() {
  const button_click = document.getElementsByClassName("start_button");
  button_click[0].addEventListener('click', function() {    
    button_click[0].remove();
    startWebpage();
  });
}

init();