/**
 * function to show profile element in navigation bar
 */
function showProfile() {
  const profileNav = document.getElementById("profile-nav");
  profileNav.hidden = false;
}
/**
 * function to hide profile element in navigation bar
 */
function hideProfile() {
  const profileNav = document.getElementById("profile-nav");
  profileNav.hidden = true;
}
/**
 * function to show login button in navigation bar
 */
function showLogin() {
  const loginNav = document.getElementById("login-nav");
  loginNav.hidden = false;
}
/**
 * function to hide login button in navigation bar
 */
function hideLogin() {
  const loginNav = document.getElementById("login-nav");
  loginNav.hidden = true;
}
/**
 * function to show logout button in navigation bar
 */
function showLogout() {
  const logoutNav = document.getElementById("logout-nav");
  logoutNav.hidden = false;
}
/**
 * function to hide logout button in navigation bar
 */
function hideLogout() {
  const logoutNav = document.getElementById("logout-nav");
  logoutNav.hidden = true;
}
/**
 * function to perfomr logic of hiding and showing elements in navigation bar based on if user has logged in or not
 */
function navLogic() {
  const token = localStorage.getItem("accessToken");
  if (token == null) {
    hideProfile();
    hideLogout();
    showLogin();
  } else {
    showProfile();
    showLogout();
    hideLogin();
  }
}

navLogic();

const logoutNav = document.getElementById("logout-nav");
logoutNav.addEventListener("click", logout);

/**
 * function to log user out and delete access token
 */
function logout() {
  localStorage.clear();
  navLogic();
}
