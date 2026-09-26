// Imports
import { Board } from "./board.script.js";
import { Car } from "./car.script.js";
import { EnemyCar } from "./enemy.script.js";

// Get elements from DOM

const boardElement = document.getElementById("board");
const playerElement = document.getElementById("car");
const bodyElement = document.getElementById("body");
const gameInfoBoard = document.getElementById("gameInfoBoard");
const gameMenu = document.getElementById("gameMenu");
const startGameBtn = document.getElementById("startGame");
const garageDoor = document.getElementById("garageDoor");
const livesDisplay = document.getElementById("livesDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const finalRank = document.getElementById("finalRank");
const restartBtn = document.getElementById("restartBtn");
const optionOne = document.getElementById("optionOne");
const optionTwo = document.getElementById("optionTwo");

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
let enemies = [];
let lives = 3;
let isInvincible = false;
let score = 0;
let spawnTimeoutId = null;
let spawnIntervalId = null;

// Car selection — maps each button to a CSS class / image for that car.
const carOptions = {
  optionOne: { className: "car-one", image: "./assets/playerCar1-image.png" },
  optionTwo: { className: "car-two", image: "./assets/playerCar2-image.png" },
};

let selectedCar = "optionOne"; // default choice before the player picks

function selectCar(choice) {
  selectedCar = choice;
  optionOne.classList.toggle("selected", choice === "optionOne");
  optionTwo.classList.toggle("selected", choice === "optionTwo");
}

function applyPlayerCarSkin() {
  // remove any previously applied skin class, then add the chosen one
  playerElement.classList.remove(
    carOptions.optionOne.className,
    carOptions.optionTwo.className,
  );
  playerElement.classList.add(carOptions[selectedCar].className);
}

optionOne.addEventListener("click", () => selectCar("optionOne"));
optionTwo.addEventListener("click", () => selectCar("optionTwo"));

selectCar(selectedCar); // reflect the default selection as soon as the page loads

function randomX(width) {
  return Math.random() * (board.width - width);
}

function isColliding(a, b) {
  return (
    a.positionX < b.positionX + b.width &&
    a.positionX + a.width > b.positionX &&
    a.positionY < b.positionY + b.height &&
    a.positionY + a.height > b.positionY
  );
}

function updateLivesDisplay() {
  livesDisplay.textContent = "❤️".repeat(Math.max(lives, 0));
}

function updateScoreDisplay() {
  scoreDisplay.textContent = score;
}

function spawnEnemy() {
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.classList.add("enemy-car");

  boardElement.appendChild(el);

  const width = 55;
  const carEnemy = new EnemyCar(100, width, randomX(width), -100, el, board);
  enemies.push(carEnemy);
}

function startSpawning() {
  // clear any previous timers first, so restarting never stacks a second spawner
  clearTimeout(spawnTimeoutId);
  clearInterval(spawnIntervalId);

  spawnTimeoutId = setTimeout(() => {
    spawnIntervalId = setInterval(spawnEnemy, 2000);
  }, 5000);
}

function endGame() {
  isRunning = false;
  player.canMove = false;
  clearTimeout(spawnTimeoutId);
  clearInterval(spawnIntervalId);

  finalScore.textContent = score;
  finalRank.textContent = "…"; // shown while the rank is being fetched
  gameOverScreen.style.display = "flex";

  showFinalStats();
}

async function showFinalStats() {
  await sendScore();
  await showRank();
}

async function sendScore() {
  try {
    const response = await fetch(
      "https://highway-hustle-game-server.onrender.com/score/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ score }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Score submitted:", data);
    } else {
      // a 400 here often just means this run wasn't a new personal best —
      // that's fine, the leaderboard already has the player's best score stored
      console.log("Score submit response:", data.message);
    }
  } catch (error) {
    console.log("Score submit error:", error);
  }
}

async function showRank() {
  try {
    const response = await fetch(
      "https://highway-hustle-game-server.onrender.com/score/scores",
    );
    const allScores = await response.json();

    const userId = localStorage.getItem("userId");
    const sorted = [...allScores].sort((a, b) => b.score - a.score);
    const rankIndex = sorted.findIndex((entry) => entry.player?._id === userId);

    finalRank.textContent =
      rankIndex === -1 ? "-" : `${rankIndex + 1} / ${sorted.length}`;
  } catch (error) {
    console.log("Leaderboard fetch error:", error);
    finalRank.textContent = "-";
  }
}

function loop() {
  if (!isRunning) return;

  enemies.forEach((enemy) => enemy.movingDown());

  enemies = enemies.filter((enemy) => {
    if (isColliding(player, enemy)) {
      if (!isInvincible) {
        lives -= 1;
        updateLivesDisplay();
        console.log("Lives left:", lives);

        isInvincible = true;
        setTimeout(() => {
          isInvincible = false;
        }, 1000);

        if (lives <= 0) {
          endGame();
        }
      }

      enemy.element.remove(); // always remove a crashed enemy — never score it,
      return false; // whether or not this specific hit cost a life
    }

    if (enemy.isOffScreen()) {
      enemy.element.remove();
      score += 1; // only reached if it wasn't a collision — a genuine dodge
      updateScoreDisplay();
      return false;
    }

    return true;
  });

  if (!isRunning) return;

  requestAnimationFrame(loop);
}

function resetGame() {
  // clear any enemies left over from the previous run
  enemies.forEach((enemy) => enemy.element.remove());
  enemies = [];

  lives = 3;
  score = 0;
  isInvincible = false;
  isRunning = true;

  // put the player back at its starting position
  player.positionX = board.width / 2 - 27.5;
  player.positionY = 600;
  player.updatePosition();
  player.canMove = true;

  updateLivesDisplay();
  updateScoreDisplay();
  gameOverScreen.style.display = "none";

  startSpawning();
  requestAnimationFrame(loop);
}

restartBtn.addEventListener("click", resetGame);

function game() {
  applyPlayerCarSkin();
  player.canMove = true;
  updateLivesDisplay();
  updateScoreDisplay();
  startSpawning();
  requestAnimationFrame(loop);
}
