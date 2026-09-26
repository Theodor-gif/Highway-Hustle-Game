"use strict";

const API_URL = "http://localhost:3000";

const registerSubmit = document.getElementById("registerForm");
const registerForm = document.getElementById("registerForm");
const logInForm = document.getElementById("logInForm");
const changeToRegister = document.getElementById("changeToRegister");
const changeToLog = document.getElementById("changeToLog");
const playerElement = document.getElementById("car");
const bodyElement = document.getElementById("body");
const logInSubmit = document.getElementById("logInForm");
const intro = document.getElementById("intro");
const firstName = document.getElementById("userName");
const surName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const correctName = document.getElementById("correctName");
const wrongName = document.getElementById("wrongName");
const correctSurname = document.getElementById("correctSurname");
const wrongSurname = document.getElementById("wrongSurname");
const correctEmail = document.getElementById("correctEmail");
const wrongEmail = document.getElementById("wrongEmail");
const correctPassword = document.getElementById("correctPassword");
const wrongPassword = document.getElementById("wrongPassword");
const passSeeImage = document.getElementById("passSee");
const passNotSeeImage = document.getElementById("passNotSee");
const passVisualBtn = document.getElementById("visualBtnPass");
const game = document.getElementById("game");
const gameMenu = document.getElementById("gameMenu");

// Default setup
gameMenu.style.display = "none";
game.style.display = "none";
bodyElement.style.display = "flex";
logInForm.style.display = "none";
correctName.style.display = "none";
wrongName.style.display = "none";
correctSurname.style.display = "none";
wrongSurname.style.display = "none";
correctEmail.style.display = "none";
wrongEmail.style.display = "none";
correctPassword.style.display = "none";
wrongPassword.style.display = "none";
passNotSeeImage.style.display = "none";

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

// Check the firstname input visual
const inputName = setInterval(() => {
  if (firstName.value.length >= 5) {
    correctName.style.display = "inline-block";
  } else {
    correctName.style.display = "none";
  }
}, 1000);

// Check the Surname input visual
const inputSurname = setInterval(() => {
  if (surName.value.length >= 5) {
    correctSurname.style.display = "inline-block";
  } else {
    correctSurname.style.display = "none";
  }
}, 1000);

// Check the Email input visual
const inputEmail = setInterval(() => {
  const inputEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(
    email.value,
  );
  if (inputEmail) {
    correctEmail.style.display = "inline-block";
  } else {
    correctEmail.style.display = "none";
  }
}, 1000);

// Check the Password input visual
const inputPassword = setInterval(() => {
  const input =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
      password.value,
    );
  if (input) {
    correctPassword.style.display = "inline-block";
  } else {
    correctPassword.style.display = "none";
  }
}, 1000);

// Password see visual

passVisualBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (password.type === "password") {
    password.type = "text";
    passNotSeeImage.style.display = "inline-block";
    passSeeImage.style.display = "none";
  } else {
    password.type = "password";
    passNotSeeImage.style.display = "none";
    passSeeImage.style.display = "inline-block";
  }
});

// Register function

registerSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = firstName.value;
  const lastName = surName.value;
  const emailAdd = email.value;
  const passwordAdd = password.value;
  const inputEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(emailAdd);
  const inputPassword =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
      passwordAdd,
    );

  try {
    if (name.length < 5) {
      setTimeout(() => {
        wrongName.style.display = "inline-block";
      }, 1000);
      setTimeout(() => {
        wrongName.style.display = "none";
        firstName.value = "";
      }, 3000);
    }
    if (lastName.length < 5) {
      setTimeout(() => {
        wrongSurname.style.display = "inline-block";
      }, 1000);
      setTimeout(() => {
        wrongSurname.style.display = "none";
        surName.value = "";
      }, 3000);
    }
    if (!inputEmail) {
      setTimeout(() => {
        wrongEmail.style.display = "inline-block";
      }, 1000);
      setTimeout(() => {
        wrongEmail.style.display = "none";
        email.value = "";
      }, 3000);
    }
    if (!inputPassword) {
      setTimeout(() => {
        wrongPassword.style.display = "inline-block";
      }, 1000);
      setTimeout(() => {
        wrongPassword.style.display = "none";
        password.value = "";
      }, 3000);
    }

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
      clearInterval(inputName);
      clearInterval(inputSurname);
      clearInterval(inputEmail);
      clearInterval(inputPassword);
      intro.style.display = "none";
      gameMenu.style.display = "flex";
      game.style.display = "flex";
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
