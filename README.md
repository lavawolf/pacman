# PACMAN

# A few words

After a tiring day of doing Analysis and Algebra, you decide that you need to play a game to get rid of all the stressful Theorem. Today you want to do something retro, something classic: **Pacman**. So you went on to Google and typed into the search box the word *Pacman*. Google is a good company, so they had their own version right at the top of the website, and you clicked on it and played for a while. But something is wrong. You feel even more tired after you play the game. You realized the problem: The game was too small, and it is definitely not good for your eye.

That's why, we are introducing (\*\*short pause\*\*) **_the revamped Pacman game_**. 

Definitely bigger than Google's version and can scale depending on your device size, you can enjoy playing the game on almost every devices you have.
The game greets you with a simple interface: click and play. The Pacman has been created with many complex algorithm in order to offer you a seamless animation and control. The ghosts have been designed with a foolproof algorithm: it will continuously confuse you what it is trying to do. Sometimes a ghosts will almost got you, but then it suddenly turns into another direction. Don't be incautious, as it is simply tricking you. Before you know it, the ghosts will suddenly move in towards you in an unexcapable manner.

So clone this github and enjoy. Try to get the highscore and beat all your friends. You can take a screenshot of the highscore and share it with the world, cause everyone is playing this game now.

**Proceed to the next part with caution**. This part is simply to explain to our professors what we did for the Pacman. Apart from them, we do not recommend you to move on, as this may include very complex and mind-blowing algorithm, as well as ruin your experience in the game once you figure out how things work.

# Pacman Implementation detail
*Read on with caution. We deny any liability if it may causes headache or disappointment*

*Please also note that this project is only for educational purposes and has no commercial purposes*
## Starting the Webpage

As soon as the document is loaded, the `init()` function is called which adds a button to start the game. When the use clicks it, the `startWebpage()` function is called which preesents a small animation (using CSS properties) after which the `main()` function is called. This is done using the `setTimeout()` function to let the animation complete before the game is loaded.

## Details for the ghosts

`Ghost` class defines all the variables used by the ghost during the game. These include the ghosts starting postion, its current position, its speed, its direction, the reverse direction (needed to stop the ghost going back), properties to check if it is scared, dead, or has left the house (needed to make sure it doesn't enter the house back).

The constant `ghosts` declares all the four ghosts.

The function `renderGhost()` draws all four ghosts using the array ghosts. It checks if the ghost is scared, if so, the ghost's image is changed and it slows down. Moreover, at each level, the speed of all ghosts increases by 0.5px/s, this ensures an increase in the difficulty of the game at each level by an undisclosed polynomial factor. Further in the function, the ghost is drawn at its current position. If the pacman hasn't started though, the ghosts don't move, and the function returns but otherwise it calls `MoveGhosts` which specify how the ghosts move.

The function `MoveGhosts()` does the following: 

-> It checks if the ghost has been eaten by the pacman, if so, then the pacman dies if the ghost is not scared otherwise the ghost dies and its position reinitialized to the starting position using the function `IsEaten()`.

-> If the ghost is at the starting position then it gives the ghost an initial direction to move using the function `SetDirection()`.

-> If the ghost has left the house, then the corresponding property is set to true to make sure the ghost doesn't enter back here unless it dies or the game is reset.

-> Then if the ghost is near the center of the cell in the map, it is repositioned to the exact center so that possible moves can found for it, if it can change direction. Otherwise, the ghost keeps on moving in the direction already assigned to it.

-> In the `if` statement, the `moves` variable is then assigned all the possible moves of the ghost by calling the `getPossible()` function which returns an object that specifies all valid directions the ghost can move in. Then the reverse direction is deleted in the possible direction in the moves variable to ensure that the ghost doesn't reverse direction. Then if there is more than one possible direction for the ghost to move, a random direction is assigned to the ghost (corresponding reverse direction is also updated) and the ghost moves by calling the `NextMove()` function.

The function `IsEaten()` checks if the ghost and pacman are very near, and if so, it passes in an if statement. Here, if the ghost is scared, then that ghost is killed and reset. Otherwise, the pacman is killed and it is reset with the ghosts using the `PacReset()` function.

The `NextMove()` function is a simple function that uses switch case to move the ghost in the direction it is already moving in.

## When all points have been eaten

If totalpoints left in the game are zero, the `restart()` function is called which updates the level of the game and resets all playing conditions back to the initial stage except the score which is not changed. The `lives` are also updated to 3 and the game starts as soon as the player presses a key. This instruction is added each time the pacman's position is reinitialized.

## When all lives are lost

If all lives have been lost, then `requestAnimationFrame()` is stopped and the `newGame()` function is called. This function adds a button in the `Scoreboard` div and allows the user to reset the playing conditions of the game and restart from level 1. It automatically updates the high score and calls
`requestAnimationFrame()` to the function `animatePac()`.
