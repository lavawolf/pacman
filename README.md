# PACMAN

# A few words

After a tiring day of doing Analysis and Algebra, you decide that you need to play a game to get rid of all the stressful Theorem. Today you want to do something retro, something classic: **Pacman**. So you went on to Google and typed into the search box the word *Pacman*. Google is a good company, so they had their own version right at the top of the website, and you clicked on it and played for a while. But something is wrong. You feel even more tired after you play the game. You realized the problem: The game was too small, and it is definitely not good for your eye.

That's why, we are introducing (\*\*short pause\*\*) **_the revamped Pacman game_**. 

Definitely bigger than Google's version and can scale depending on your device size, you can enjoy playing the game on almost every devices you have.
The game greets you with a simple interface: click and play. The Pacman has been created with many complex algorithm in order to offer you a seamless animation and control. The ghosts have been designed with a foolproof algorithm: it will continuously confuse you what it is trying to do. Sometimes a ghost will alnearly get you, but No! It suddenly turns into another direction. Let's be very cautious here, the ghost is playing pseudorandom mean tricks. Before you know it, it will move in towards you in an unescapable manner.

So, clone this github and enjoy. Try to get the highscore and beat all your friends. You can take a screenshot of the highscore and share it with the world, cause everyone is playing this game now.

**Proceed to the next part with caution**. This part is intended to explain what we did for the Pacman. We do not recommend you to move on, as this not only includes extremely complex and mind-blowing algorithms, it may as well ruin your experience in the game once you figure out how things work.

# Pacman Implementation detail
*Read on with caution. We deny any liability if it may cause headache for the weak-minded or disappointment for the strong-minded*

*Please note that this project is only for educational purposes with no commercial strings attached. All rights reserved with Nhat and Vrushank*
## Starting the Webpage

As soon as the document is loaded, the `init()` function is called which adds a button to start the game. When the user clicks it, the `startWebpage()` function is called which preesents a small animation (made using Adobe After Effects and modified using CSS properties) after which the `main()` function is called. This is done using the `setTimeout()` function to let the animation complete before the game is fully loaded.

## Let's start with the grid

In order to simplify animations, we created the grid as a group of `<div>` (called `cell`). Each `cell` has its own state (`blockState`, `noneState`, `pointState`, or `powerState`) to denote how it should be rendered by `renderCell()`. We used a predefined map (at the beginning of `script.js`, and called `renderGrid()` to do this, storing the grid in the 2d array `grid`. In order to make Pacman eat a point, we simply remove the `point` or `power` element inside each `cell` with `eatCell()` as the Pacman moves around.

## Pacman Creation

We drawed Pacman by using a `<canvas>` right on top of the grid, alternating between two images: *pacman_closed.png* and *pacman_eating.png* (made using Adobe Photoshop) by the function `animatePac()`. In order to specify direction, we used the variable `dir`, and used `queryTicks` and `queryDir` to make Pacman turning smoother (see `turn()`).

In `animatePac()`, the main function for controlling Pacman, we did the following:

We first update the position of Pacman with `dir` and `pacSpeed`. We then check if that is a valid position (Pacman does not run into a wall). If not, we set it back to the previous position. If it is valid, we then continue by eating the point (if available) with `eatCell()`, we update corresponding variables, and then continue to the next frame.

## Details for the ghosts

The `Ghost` class defines all the variables used by the ghost during the game. These include the ghosts starting postion, its current position, speed, direction, reverse direction (needed by the ghost to avoid turning back), and  other properties to check if it is scared, dead, or has left the house (needed to make sure it doesn't enter the house once it has left).

The constant `ghosts` declares all the four ghosts in the next few lines.

The function `renderGhost()` draws all four ghosts using the array `ghosts`. It checks if the specific ghost is scared, if so, the ghost's image is changed accordingly and its speed reduced by a factor of 1.5. Moreover, at each level, the speed of all ghosts increases by 0.5px/s, this ensures an increase in the difficulty of the game at each level by an undisclosed polynomial factor. Further in the function, the ghost is redrawn at its current position on the canvas. If the pacman hasn't started though, the ghosts don't move, and the function returns None, but otherwise it calls the function `MoveGhosts` which specifies how the ghosts move.

The function `MoveGhosts()` does the following: 

-> It checks if the ghost and pacman have inadvertently (or maybe on purpose) have met. If so, the pacman dies only if the ghost is not scared, but if the ghost is scared, the ghost dies and its position is reinitialized to its starting position using the function `IsEaten()`.

-> If the ghost is at the starting position then it gives the ghost an initial direction to move using the function `SetDirection()`.

-> If the ghost has left the house, then the corresponding property is set to true to make sure the ghost doesn't enter back here unless it dies or the game is reset.

-> Hereafter, if the ghost is near the center of the cell in the map, it is repositioned to the exact center so that the next possible moves can found for it, if it can change direction. Otherwise, the ghost keeps on moving in the direction already assigned to it.

-> In the `if` statement, the `moves` variable is then assigned all the possible moves of the ghost by calling the `getPossible()` function which returns an object that specifies all valid directions the ghost can move in. Then the reverse direction is deleted in the possible direction in the moves variable to ensure that the ghost doesn't reverse direction. Then if there is more than one possible direction for the ghost to move, a random direction is assigned to the ghost (corresponding reverse direction is also updated) and the ghost moves by calling the `NextMove()` function.

The function `IsEaten()` checks if the ghost and pacman are very near, and if so, it passes in an if statement. Here, if the ghost is scared, then that ghost is killed and reset. Otherwise, the pacman is killed and it is reset with the ghosts using the `PacReset()` function.

The `NextMove()` function is a simple function that uses switch case to move the ghost in the direction it is already moving in.

## When all points have been eaten

If totalpoints left in the game are zero, the `restart()` function is called which updates the level of the game and resets all playing conditions back to the initial stage except the score which is not changed. The `lives` are also updated to 3 and the game starts as soon as the player presses a key. This instruction is added each time the pacman's position is reinitialized.

## When all lives are lost

If all lives have been lost, then `requestAnimationFrame()` is stopped and the `newGame()` function is called. This function adds a button in the `Scoreboard` div and allows the user to reset the playing conditions of the game and restart from level 1. It automatically updates the high score and calls
`requestAnimationFrame()` to the function `animatePac()`.
