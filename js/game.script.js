// Imports
import { Board } from "./board.script.js";
import { Car } from "./car.script.js";

// Get elements from DOM
const registerForm = document.getElementById("registerForm");
const logInForm = document.getElementById("logInForm");
const changeToRegister = document.getElementById("changeToRegister");
const changeToLog = document.getElementById("changeToLog");
const boardElement = document.getElementById("board");
const playerElement = document.getElementById("car");
const bodyElement = document.getElementById("body");

// Default setup
boardElement.style.display = "none";
bodyElement.style.display = "flex";
logInForm.style.display = "none";

// Display Log in form
changeToRegister.addEventListener("click", () => {
  registerForm.style.display = "none";
  logInForm.style.display = "inline-block";
});

// Display Register form
changeToLog.addEventListener("click", () => {
  registerForm.style.display = "inline-block";
  logInForm.style.display = "none";
});

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
