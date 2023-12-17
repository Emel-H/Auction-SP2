import {
  profileInfo,
  profileBids,
  listingDelete,
  avatarUpdate,
} from "../RESTAPI_module.mjs";

/**
 * function to attempt to get a user profile, if the response is ok from the API the user information is then populated in various sections on the profile page
 * @param {string} username the username of the profile to be retrieved
 */
async function setProfile(username) {
  try {
    const token = localStorage.getItem("accessToken");
    if (token == null) {
      document.location.href = "../";
    } else {
      const response = await profileInfo(username, token);
      if (response.ok) {
        const jsonReturn = await response.json();
        setProfileName(jsonReturn);
        setProfileAvatar(jsonReturn);
        setProfileEmail(jsonReturn);
        setProfileCredits(jsonReturn);
        setProfileWins(jsonReturn);
        enableCreateListingAndUpdateAvatar(username);
        setProfileListings(jsonReturn);
      } else {
        const jsonReturn = await response.json();
        alert(jsonReturn.errors[0].message);
      }
    }
  } catch (error) {
    // catches errors both in fetch and response.json
    console.log(error);
  }
}

/**
 * function to attempt to get a user profile bids, if the response is ok from the API the user information is then populated in various sections on the profile page
 * @param {string} username the username of the profile to be retrieved
 */
async function setProfileBids(username) {
  try {
    const token = localStorage.getItem("accessToken");
    if (token == null) {
      document.location.href = "../";
    } else {
      const response = await profileBids(username, token);
      if (response.ok) {
        const jsonReturn = await response.json();
        setBids(jsonReturn);
      } else {
        const jsonReturn = await response.json();
        alert(jsonReturn.errors[0].message);
      }
    }
  } catch (error) {
    // catches errors both in fetch and response.json
    console.log(error);
  }
}

/**
 * function to enable the create new listing button if you are viewing your profile
 * @param {string} username the current username of the profile viewed
 */
function enableCreateListingAndUpdateAvatar(username) {
  if (username === localStorage.getItem("username")) {
    addListingButton.className = "btn btn-primary col-4";
    updateAvatarForm.className = "";
    updateAvatarButton.addEventListener("click", (e) => {
      updateAvatar(username);
    });
  }
}

/**
 * function to update avatar of your profile
 * @param {string} username the user to update the image of
 */
async function updateAvatar(username) {
  try {
    const url = document.getElementById("avatarUrlInput").value;
    const token = localStorage.getItem("accessToken");
    const response = await avatarUpdate(url, username, token);
    if (response.ok) {
      document.location.href = "../profile/index.html";
    } else {
      const jsonReturn = await response.json();
      alert(jsonReturn.errors[0].message);
    }
  } catch (error) {
    // catches errors both in fetch and response.json
    console.log(error);
  }
}

/**
 * function to delete a post
 * @param {number} id identifier of the post to be deleted
 */
async function deleteListing(id) {
  try {
    const token = localStorage.getItem("accessToken");
    if (token == null) {
      document.location.href = "../";
    } else {
      const response = await listingDelete(id, token);
      if (response.ok) {
        document.location.href = "../profile";
      } else {
        const jsonReturn = await response.json();
        alert(jsonReturn.errors[0].message);
      }
    }
  } catch (error) {
    // catches errors both in fetch and response.json
    console.log(error);
  }
}

/**
 * function to populate the profile name
 * @param {JSON} jsonReturn the json returned from the API call attempt
 */
function setProfileName(jsonReturn) {
  const profileName = document.getElementById("profileName");
  profileName.innerHTML = jsonReturn.name;
}

/**
 * function to populate the profile image/avatar
 * @param {JSON} jsonReturn the json returned from the API call attempt
 */
function setProfileAvatar(jsonReturn) {
  const profileImage = document.getElementById("profileImage");
  if (jsonReturn.avatar != "") {
    profileImage.src = jsonReturn.avatar;
  } else {
    profileImage.src = "../images/profile.png";
  }
}

/**
 * function to populate the profile email
 * @param {JSON} jsonReturn the json returned from the API call attempt
 */
function setProfileEmail(jsonReturn) {
  const profileEmail = document.getElementById("profileEmail");
  profileEmail.innerHTML = jsonReturn.email;
}

/**
 * function to populate the profile followers by itterating over the list
 * @param {JSON} jsonReturn the json returned from the API call attempt
 */
function setProfileCredits(jsonReturn) {
  const credits = document.getElementById("profileCredits");
  credits.innerHTML += jsonReturn.credits;
}

/**
 * function to populate the profile followering by itterating over the list
 * @param {JSON} jsonReturn the json returned from the API call attempt
 */
function setProfileWins(jsonReturn) {
  const wins = document.getElementById("profileWins");
  wins.innerHTML += jsonReturn.wins.length;
}

/**
 * function to populate the profile posts by itterating over the list. if this happens to by posts by the logged in user, edit and delete options are added in the form of buttons
 * @param {JSON} jsonReturn the json returned from the API call attempt
 */
function setProfileListings(jsonReturn) {
  const listings = document.getElementById("profileListings");
  const addListingButton = document.getElementById("addListingButton");
  const profileListings = jsonReturn.listings;
  profileListings.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card my-2";
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    const listingTitle = document.createElement("h4");
    listingTitle.textContent = element.title;
    cardHeader.append(listingTitle);
    const listingUpdateDate = document.createElement("p");
    listingUpdateDate.textContent =
      "last updated: " + new Date(element.updated).toLocaleDateString("en-UK");
    cardHeader.append(listingUpdateDate);
    const listingExpireDate = document.createElement("p");
    listingExpireDate.textContent =
      "Expires: " + new Date(element.endsAt).toLocaleDateString("en-UK");
    cardHeader.append(listingExpireDate);
    card.append(cardHeader);
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    if (element.media.length > 0) {
      const postBodyImage = document.createElement("img");
      postBodyImage.className = "card-text img-flud col-5 object-fit-scale";
      postBodyImage.src = element.media[0];
      postBodyImage.alt = "listing main image";
      cardBody.append(postBodyImage);
    }
    const listingDescription = document.createElement("p");
    listingDescription.className = "card-text text-truncate";
    listingDescription.textContent = element.description;
    cardBody.append(listingDescription);
    const readMore = document.createElement("a");
    readMore.href = "../post/?id=" + element.id + "&edit=false";
    readMore.className = "btn btn-light";
    readMore.innerHTML = "View";
    cardBody.append(readMore);
    if (username === localStorage.getItem("username")) {
      addListingButton.className = "btn btn-primary col-4";
      const edit = document.createElement("a");
      edit.href = "../post/?id=" + element.id + "&edit=true";
      edit.className = "btn btn-info text-white mx-2";
      edit.innerHTML = "Edit";
      cardBody.append(edit);
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn btn-dark float-end";
      deleteButton.innerHTML = "Delete";
      deleteButton.addEventListener("click", (e) => {
        deleteListing(element.id);
      });
      cardBody.append(deleteButton);
    }
    card.append(cardBody);
    listings.append(card);
  });
}

/**
 * function to populate the profile bids by itterating over the list. if this happens to by posts by the logged in user, edit and delete options are added in the form of buttons
 * @param {JSON} jsonReturn the json returned from the API call attempt
 */
function setBids(jsonReturn) {
  const bids = document.getElementById("profileBids");
  const profileBids = jsonReturn;
  profileBids.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card my-2";
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    const listingTitle = document.createElement("h4");
    listingTitle.textContent =
      element.listing.title + " - Your Bid: " + element.amount + " credit(s)";
    cardHeader.append(listingTitle);
    const listingUpdateDate = document.createElement("p");
    listingUpdateDate.textContent =
      "date of bid: " + new Date(element.created).toLocaleDateString("en-UK");
    cardHeader.append(listingUpdateDate);
    const listingExpireDate = document.createElement("p");
    listingExpireDate.textContent =
      "Listing Expires: " +
      new Date(element.listing.endsAt).toLocaleDateString("en-UK");
    cardHeader.append(listingExpireDate);
    card.append(cardHeader);
    const cardBody = document.createElement("div");
    cardBody.className = "card-body row";
    if (element.listing.media.length > 0) {
      const postBodyImage = document.createElement("img");
      postBodyImage.className = "card-text col-3 img-fluid object-fit-scale";
      postBodyImage.src = element.listing.media[0];
      postBodyImage.alt = "listing main image";
      cardBody.append(postBodyImage);
    }
    const listingDescription = document.createElement("p");
    listingDescription.className = "card-text mx-1 col-8 text-truncate";
    listingDescription.textContent = element.listing.description;
    cardBody.append(listingDescription);
    const readMore = document.createElement("a");
    readMore.href = "../post/?id=" + element.listing.id + "&edit=false";
    readMore.className = "btn btn-light mt-1";
    readMore.innerHTML = "View";
    cardBody.append(readMore);
    card.append(cardBody);
    bids.append(card);
  });
}

/**
 * function to set which profile will be viewed based on if this is thecurrent users profile or a another user
 */
function setProfileUser() {
  const queryString = document.location.search;
  const params = new URLSearchParams(queryString);
  const user = params.get("user");
  if (user != null) {
    username = user;
  }
}

let username = localStorage.getItem("username");
setProfileUser();
setProfile(username);
setProfileBids(username);
