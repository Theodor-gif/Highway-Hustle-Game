// Imports
import { Board } from "./board.script.js";
import { Car } from "./car.script.js";

// Get elements from DOM

const boardElement = document.getElementById("board");
const playerElement = document.getElementById("car");
const bodyElement = document.getElementById("body");

// Create the board and the player
const board = new Board(300, 1000, boardElement);
const player = new Car(
  55,
  100,
  board.width / 2 - 20,
  600,
  playerElement,
  board,
);

// Start the game
function game() {
  player.drive();
}
