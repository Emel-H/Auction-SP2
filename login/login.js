import { loginUser } from "../RESTAPI_module.mjs";

/**
 * function to attempt logging in, if the response is ok from the API the user information is stored in local storage and user is directed to their profile page
 * @param {user} user the user information from the login page
 */
async function login(user) {
  try {
    const response = await loginUser(user);
    const jsonReturn = await response.json();
    console.log(jsonReturn);

    if (response.ok) {
      localStorage.username = jsonReturn.name;
      localStorage.email = jsonReturn.email;
      localStorage.credits = jsonReturn.credits;
      localStorage.accessToken = jsonReturn.accessToken;
      localStorage.avatar = jsonReturn.avatar;
      console.log(document.location.href);
      document.location.href = "../index.html";
      console.log(document.location.href);
    } else {
      const message = document.getElementById("userFeedback");
      message.innerHTML = jsonReturn.errors[0].message;
      message.style.color = "red";
    }
  } catch (error) {
    // catches errors both in fetch and response.json
    console.log(error);
  }
}

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("InputEmail").value;
  const password = document.getElementById("InputPassword").value;

  const user = {
    email: email,
    password: password,
  };

  login(user);
});
