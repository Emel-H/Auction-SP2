const noroffLoginUrl = "https://api.noroff.dev/api/v1/social/auth/login";
const noroffRegisterUrl = "https://api.noroff.dev/api/v1/auction/auth/register";
const noroffProfileUrl = "https://api.noroff.dev/api/v1/social/profiles/";
const noroffPostsUrl = "https://api.noroff.dev/api/v1/social/posts/";

/**
 * Modular function to login a user using Noroff API
 * @param {user} user the user information for the login 
 * @returns {string} API response of the login attempt
 */
async function loginUser(user){
    const response = await fetch(noroffLoginUrl, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
    });
    return response;
}

/**
 * Modular function to register a new user using Noroff API
 * @param {user} user the user information for the registration 
 * @returns {string} API response of the registration attempt
 */
async function registerUser(user){
    const response = await fetch(noroffRegisterUrl, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
    });
    return response;
}

/**
 * Modular function to retrive the profile information (including posts, followers, and following) of a given user using Noroff API
 * @param {string} username the username of the profile to be retrieved 
 * @param {string} token the JWT token of the user currently logged in 
 * @returns {string} API response of the GET profile attempt
 */
async function profileInfo(username, token){
    const response = await fetch(noroffProfileUrl+username+"?_posts=true&_followers=true&_following=true", {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${token}`,
          },
        
    });
    return response;
}

/**
 * Modular function to delete a given post using Noroff API
 * @param {string} id the identifier of the post 
 * @param {string} token the JWT token of the user currently logged in 
 * @returns {string} API response of the DELETE post attempt
 */
async function postDelete(id, token){
    const response = await fetch(noroffPostsUrl+id, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${token}`,
          },
    });
    return response;
}

/**
 * Modular function to get a given post using Noroff API
 * @param {string} id the identifier of the post 
 * @param {string} token the JWT token of the user currently logged in 
 * @returns {string} API response of the GET post attempt
 */
async function postGet(id, token){
    const response = await fetch(noroffPostsUrl+id+"?_author=true", {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
}

/**
 * Modular function to update a given post using Noroff API
 * @param {string} id the identifier of the post 
 * @param {string} token the JWT token of the user currently logged in 
 * @returns {string} API response of the PUT post attempt to update a post
 */
async function postEdit(id, token){
    const response = await fetch(noroffPostsUrl+id, {
        method: 'PUT',
        body: JSON.stringify({
            title: document.getElementById("postTitle").value,
            body: document.getElementById("postBody").value,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${token}`,
          },
    });
    return response;
}

/**
 * Modular function to add a new post using Noroff API
 * @param {string} token the JWT token of the user currently logged in 
 * @returns {string} API response of the POST a new post attempt
 */
async function postNew(token){
    const response = await fetch(noroffPostsUrl, {
        method: 'POST',
        body: JSON.stringify({
            title: document.getElementById("postTitle").value,
            body: document.getElementById("postBody").value,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${token}`,
          },
    });
    return response;
}

export{loginUser, registerUser, profileInfo, postDelete, postGet, postEdit, postNew};