import { listingGet } from "../RESTAPI_module.mjs";
let listingsArray;

/**
 * function to populate the page with posts based on filters and searched results
 */
async function getListings() {
  try {
    listingsArray = new Array();
    let isMoreListings = true;
    let offset = 0;
    const order = document.getElementById("listingOrder").value;
    const show = document.getElementById("listingShow").value;
    while (isMoreListings) {
      const response = await listingGet("", show, order, offset);
      const jsonReturn = await response.json();
      if (response.ok) {
        getListingsArray(jsonReturn);
      }
      if (listingsArray.length != offset + 100) {
        isMoreListings = false;
      }
      offset += 100;
    }
    const search = document.getElementById("searchinput").value;
    setListings(listingsArray, search);
  } catch (error) {
    // catches errors both in fetch and response.json
    console.log(error);
  }
}

/**
 * function to populate the the post array with the posts in the response form the REST API
 * @param {JSON} jsonReturn the json returned from the API call attempt with data on filtered posts
 */
function getListingsArray(jsonReturn) {
  const token = localStorage.getItem("accessToken");
  const listingPosts = jsonReturn;
  listingPosts.forEach((element) => {
    const card = document.createElement("div");
    card.className = "card my-2";
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    const postTitle = document.createElement("h4");
    postTitle.textContent = element.title;
    cardHeader.append(postTitle);
    const postOwner = document.createElement("a");
    if (token == null || token == "") {
    } else {
      postOwner.href = "../profile/index.html?user=" + element.seller.name;
    }
    postOwner.textContent = "Created by " + element.seller.name;
    cardHeader.append(postOwner);
    const postDate = document.createElement("p");
    postDate.textContent = new Date(element.endsAt).toLocaleDateString("en-UK");
    cardHeader.append(postDate);
    card.append(cardHeader);
    const cardBody = document.createElement("div");
    cardBody.className = "card-body row";
    if (element.media.length > 0) {
      const postBodyImage = document.createElement("img");
      postBodyImage.className = "col-3 img-fluid my-1 object-fit-scale";
      postBodyImage.src = element.media[0];
      cardBody.append(postBodyImage);
    }
    const postBody = document.createElement("div");
    postBody.className = "card-text col-7 mx-2";
    const postDescription = document.createElement("p");
    postDescription.textContent = element.description;
    postBody.append(postDescription);
    if (token == null || token == "") {
      const postBodyBids = document.createElement("p");
      postBodyBids.className = "card-text text-info";
      postBodyBids.textContent =
        "Bids can only be placed or viewed by registered users, please login or register to get the full experience";
      postBody.append(postBodyBids);
    } else {
      if (element._count.bids > 0) {
        const postBodyBids = document.createElement("p");
        postBodyBids.className = "card-text text-info";
        postBodyBids.innerHTML =
          "Bids: " +
          element._count.bids +
          "<br> Latest Bid: " +
          element.bids[element._count.bids - 1].amount +
          " creadit(s) by: " +
          element.bids[element._count.bids - 1].bidderName;
        postBody.append(postBodyBids);
      }
    }
    cardBody.append(postBody);
    const readMore = document.createElement("a");
    readMore.href = "../post/?id=" + element.id + "&edit=false";
    readMore.className = "btn btn-light";
    readMore.innerHTML = "View";
    cardBody.append(readMore);
    card.append(cardBody);
    listingsArray.push(card);
  });
}

/**
 * function to the HTML elemets for posts based on the filtering and searched phrase of the user. it also sets the number of responses retrieved
 * @param {Array} listingsArray and array of HTML elements corresponding to the posts
 * @param {string} search string of the searched phrase
 */
function setListings(listingsArray, search) {
  const posts = document.getElementById("listings");
  posts.innerHTML = "";
  const filteredPosts = listingsArray.filter((card) => {
    if (search == "") {
      return true;
    } else {
      if (
        String(card.innerHTML)
          .replace(/<[^>]+>/g, "")
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    }
  });

  const results = document.createElement("p");
  results.innerHTML = "Found " + filteredPosts.length + " results";
  results.className = "text-center my-3";
  posts.append(results);

  filteredPosts.forEach((element) => {
    posts.append(element);
  });
}

document.getElementById("submit").addEventListener("click", (e) => {
  const posts = document.getElementById("listings");
  posts.innerHTML =
    "<div class='d-flex justify-content-center'><div class='my-3 spinner-border text-primary' role='status'><span class='visually-hidden'>Loading...</span></div></div>";
  getListings();
});

getListings();
