"use strict";

const API_URL = "http://localhost:3000";

const registerSubmit = document.getElementById("registerForm");
const registerForm = document.getElementById("registerForm");
const logInForm = document.getElementById("logInForm");
const changeToRegister = document.getElementById("changeToRegister");
const changeToLog = document.getElementById("changeToLog");
const boardElement = document.getElementById("board");
const playerElement = document.getElementById("car");
const bodyElement = document.getElementById("body");
const logInSubmit = document.getElementById("logInForm");
const intro = document.getElementById("intro");
const firstName = document.getElementById("userName");
const surName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");

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

setInterval(() => {}, 1000);

// Register function

registerSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = firstName.value;
  const lastName = surName.value;
  const emailAdd = email.value;
  const passwordAdd = password.value;

  try {
    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: name,
        surname: lastName,
        email: emailAdd,
        password: passwordAdd,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      registerForm.style.display = "none";
      logInForm.style.display = "inline-block";
    }

    console.log(data);
  } catch (error) {
    console.log("Register error:", error);
  }
});

// Log in function

logInSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailLog = document.getElementById("emailLog").value;
  const passwordLog = document.getElementById("passwordLog").value;

  try {
    const response = await fetch(`${API_URL}/user/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailLog,
        password: passwordLog,
      }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      intro.style.display = "none";
      boardElement.style.display = "inline-block";
      bodyElement.style.cssText = `
        background-image: url("../assets/game-background-image.jpg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 100vh;
      `;
      console.log("Logged in!!", data);
    } else {
      console.log("Failed to log in", data.message);
    }
  } catch (error) {
    console.log("Login error:", error);
  }
});
