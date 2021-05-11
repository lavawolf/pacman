# pacman details

# Starting the Webpage

As soon as the document is loaded, the init() function is called which adds a button to start the game. When the use clicks it, the startWebpage() function is called which preesents a small animation (using CSS properties) after which the main() function is called. This is done using the setTimeout function to let the animation complete before the game is loaded.

# Details for the ghosts

Ghost class defines all the variables used by the ghost during the game. These include the ghosts starting postion, its current position, its speed, its direction, the reverse direction (needed to stop the ghost going back), properties to check if it is scared, dead, or has left the house (needed to make sure it doesn't enter the house back).

The constant ghosts declares all the four ghosts.

The function renderGhost() draws all four ghosts using the array ghosts. It checks if the ghost is scared, if so, the ghost's image is changed and it slows down. Then the ghost is drawn at its current position. If the pacman hasn't started though, the ghosts don't move, and the function returns but otherwise it calls MoveGhosts which specify how the ghosts move.

The function MoveGhosts() does the following: 

-> It checks if the ghost has been eaten by the pacman, if so, then the pacman dies if the ghost is not scared otherwise the ghost dies and its position reinitialized to the starting position using the function IsEaten().

-> If the ghost is at the starting position then it gives the ghost an initial direction to move using the function SetDirection().

-> If the ghost has left the house, then the corresponding property is set to true to make sure the ghost doesn't enter back here unless it dies or the game is reset.

-> Then if the ghost is near the center of the cell in the map, it is repositioned to the exact center so that possible moves can found for it, if it can change direction. Otherwise, the ghost keeps on moving in the direction already assigned to it.

-> In the if statement, the moves variable is then assigned all the possible moves of the ghost by calling the getPossible() function which returns an object that specifies all valid directions the ghost can move in. Then the reverse direction is deleted in the possible direction in the moves variable to ensure that the ghost doesn't reverse direction. Then if there is more than one possible direction for the ghost to move, a random direction is assigned to the ghost (corresponding reverse direction is also updated) and the ghost moves by calling the NextMove() function.

The function IsEaten() checks if the ghost and pacman are very near, and if so, it passes in an if statement. Here, if the ghost is scared, then that ghost is killed and reset. Otherwise, the pacman is killed and it is reset with the ghosts using the PacReset() function.

The NextMove() function is a simple function that uses switch case to move the ghost in the direction it is already moving in.

# When all points have been eaten

If totalpoints left in the game are zero, the restart() function is called which updates the level of the game and resets all playing conditions back to the initial stage except the score which is not changed. The lives are also updated to 3.

# When all lives are lost

If all lives have been lost, then requestAnimationFrame() is stopped and the newGame() function is called. This function adds a button in the Scorebord div and allows the user to reset the playing conditions of the game and restart from level 1. It automatically updates the high score and calls
requestAnimationFrame() to the function animatePac().
