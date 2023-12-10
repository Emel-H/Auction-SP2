
import{listingGet} from "../RESTAPI_module.mjs";
let listingsArray;

/**
 * function to populate the page with posts based on filters and searched results
 */
async function getlistings(){
    try {
        
        const response = await listingGet("");
        const jsonReturn = await response.json();
        
        if(response.ok){
            getListingsArray(jsonReturn);
            const search = document.getElementById("searchinput").value;
            setListings(listingsArray, search);
        }
        
    }
    catch (error) {
        // catches errors both in fetch and response.json
        console.log(error);
    }
}

/**
 * function to populate the the post array with the posts in the response form the REST API
 * @param {JSON} jsonReturn the json returned from the API call attempt with data on filtered posts
 */
function getListingsArray(jsonReturn){
    listingsArray = new Array();
    const listingPosts = jsonReturn;
    listingPosts.forEach(element => {
        const card = document.createElement("div");
        card.className = "card my-2";
        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header";
        const postTitle = document.createElement("h4");
        postTitle.innerHTML = element.title;
        cardHeader.append(postTitle);
        const postOwner = document.createElement("p");
        postOwner.innerHTML = "Created by "+element.seller.name + " <br> " + new Date(element.updated);
        cardHeader.append(postOwner);
        card.append(cardHeader);
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
        const postBodyImage = document.createElement("img");
        postBodyImage.className = "card-text";
        postBodyImage.href = element.media[0];
        cardBody.append(postBodyImage);
        const postBody = document.createElement("p");
        postBody.className = "card-text";
        postBody.innerHTML = "Description:<br>"+element.description;
        cardBody.append(postBody);
        if(element._count.bids>0)
        {
            const postBodyBids = document.createElement("p");
            postBodyBids.className = "card-text text-info";
            postBodyBids.innerHTML = "Bids: "+element._count.bids + "<br> Latest Bid: " + element.bids[element._count.bids-1].amount + " creadit(s) by: " +element.bids[element._count.bids-1].bidderName ;
            cardBody.append(postBodyBids);
        }
        const readMore = document.createElement("a");
        readMore.href = "../post/?id="+element.id+"&edit=false";
        readMore.className = "btn btn-light";
        readMore.innerHTML = "Read more";
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
function setListings(listingsArray,search){
    const posts = document.getElementById("listings");
    posts.innerHTML = "";
    const filteredPosts = listingsArray.filter((card) => {
    if(search==""){
        return true;
    } else{
        if (String(card.innerHTML).replace(/<[^>]+>/g, '').toLowerCase().includes(search.toLowerCase())) {
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

    filteredPosts.forEach(element => {
        posts.append(element); 
    });
}

document.getElementById("submit").addEventListener("click", (e) => {
    getlistings();
  });

getlistings();