import { registerUser } from "../RESTAPI_module.mjs";

/**
 * function to attempt registeringa new user, if the response is ok from the API the user information user is directed to the login page
 * @param {user} user the user information from the registration page
 */
async function register(user) {
  try {
    const response = await registerUser(user);
    const jsonReturn = await response.json();
    console.log(jsonReturn);

    if (response.ok) {
      loginForm.hidden = true;
      message.innerHTML = "Registration successful, redirecting to login page.";
      message.style.color = "Green";
      redirect();
    } else {
      message.innerHTML = jsonReturn.errors[0].message;
      message.style.color = "red";
    }
  } catch (error) {
    // catches errors both in fetch and response.json
    console.log(error);
  }
}

/**
 * function to redirect the user to a page after 2 seconds of successful registration attempt
 */
function redirect() {
  setTimeout(myURL, 2000);
}

/**
 * function to specify url of login page that i want to redirect to
 */
function myURL() {
  document.location.href = "../index.html";
}

const message = document.getElementById("userFeedback");
const loginForm = document.getElementById("RegistrationForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("FirstName").value;
  const lastName = document.getElementById("LastName").value;
  const email = document.getElementById("InputEmail").value;
  const password = document.getElementById("InputPassword").value;
  const avatar = document.getElementById("avatar").value;

  const user = {
    name: firstName + "_" + lastName,
    email: email,
    password: password,
    avatar: avatar,
  };

  register(user);
});
