// Imports
import { Board } from "./board.script.js";
import { Car } from "./car.script.js";

// Get elements from DOM

const boardElement = document.getElementById("board");
const playerElement = document.getElementById("car");
const bodyElement = document.getElementById("body");
const gameInfoBoard = document.getElementById("gameInfoBoard");
const gameMenu = document.getElementById("gameMenu");
const startGameBtn = document.getElementById("startGame");
const garageDoor = document.getElementById("garageDoor");

// Default settings

// Create the board and the player
const board = new Board(300, 800, boardElement);
const player = new Car(
  55,
  100,
  board.width / 2 - 27.5,
  600,
  playerElement,
  board,
);

startGameBtn.addEventListener("click", () => {
  startGameBtn.disabled = true;
  gameMenu.style.display = "none";
  const openGame = setInterval(() => {
    garageDoor.style.bottom =
      parseInt(garageDoor.style.bottom || 0) + 20 + "px";

    if (garageDoor.style.bottom === "700px") {
      clearInterval(openGame);
      game();
    }
  }, 50);
});

// Start the game
let isRunning = true;

function game() {
  player.canMove = true;
  function loop() {
    if (!isRunning) return;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// later, to stop:
// isRunning = false;
