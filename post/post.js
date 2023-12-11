import{listingGet, listingEdit, listingNew} from "../RESTAPI_module.mjs";

/**
 * function to get a specific post, based on the request you will get a new post adding view, or an edit option or simply view option for the post
 * @param {number} id identified of the post 
 */
async function getPost(id){
    try {
        const token = localStorage.getItem('accessToken');
        if(token==null){
            document.location.href = '../';
        }else{
            if(newEntry==="true"){
                setPostNew();
            }
            else{
                const response = await listingGet(id, token);
                const jsonReturn = await response.json();
                
                if(response.ok){
                    
                    if(edit==="true"){
                        setPostEdit(jsonReturn);
                    } else {
                        setPostView(jsonReturn);
                    }
                    
                }
            }
        }
    }
    catch (error) {
        // catches errors both in fetch and response.json
        console.log(error);
    }
}

/**
 * function to send an edit request, if response is ok you are redirected to profile page to view the edits 
 * @param {number} id identifier of the post to edit 
 */
async function editPost(id){
    try {
        const token = localStorage.getItem('accessToken');
        if(token==null){
            document.location.href = '../';
        }else{
            const response = await listingEdit(id, token);
            if(response.ok){
                document.location.href = '../profile';
            }
            else{
                alert("Please check your inputs and fill in required field before submitting");
            }
        }
    }
    catch (error) {
        // catches errors both in fetch and response.json
        console.log(error);
    }
}

/**
 * function to add a new post via noroff RESTAPI, if response is ok the user is redirected to profile page to see the post added among their posts
 */
async function newPost(){
    try {
        const token = localStorage.getItem('accessToken');
        if(token==null){
            document.location.href = '../';
        }else{
            const response = await listingNew(token);
            if(response.ok){
                document.location.href = '../profile';
            }
            else{
                alert("Please check your inputs and fill in required field before submitting");
            }
        }
    }
    catch (error) {
        // catches errors both in fetch and response.json
        console.log(error);
    }
}

/**
 * function to populate the page with a form to add a new post 
 */
function setPostNew(){
    const post = document.getElementById("singlePost");
    const form = document.createElement("form");
    form.addEventListener('submit', (e) => {e.preventDefault();});
    form.onkeydown = "return event.key != 'Enter';";

    const title = document.createElement("div");
    title.className = "form-group my-2";
    const titleLabel = document.createElement("label");
    titleLabel.innerHTML = "Post Title:";
    const postTitle = document.createElement("input");
    postTitle.type = "text";
    postTitle.className = "form-control";
    postTitle.id= "postTitle";
    title.append(titleLabel);
    title.append(postTitle);

    const date = document.createElement("div");
    date.className = "form-group my-2";
    const dateLabel = document.createElement("label");
    dateLabel.innerHTML = "Expiration Date:";
    const postDate = document.createElement("input");
    postDate.type = "date";
    postDate.className = "form-control";
    postDate.id= "postDate";
    postDate.required = true;
    date.append(dateLabel);
    date.append(postDate);

    const media = document.createElement("div");
    media.className = "form-group my-2";
    const mediaLabel = document.createElement("label");
    mediaLabel.innerHTML = "Media images:";
    const postMedia = document.createElement("input");
    postMedia.type = "text";
    postMedia.className = "form-control";
    postMedia.id= "postMedia";
    const postNoteMedia = document.createElement("small");
    postNoteMedia.className = "form-text text-muted";
    postNoteMedia.innerHTML = "Add media images to your auction listing by adding image URLs sepertaed by commas (example: https://url.com/image1.jpg, https://url.com/image2.jpg,...,https://url.com/image3.jpg)(optional)";
    media.append(mediaLabel);
    media.append(postMedia);
    media.append(postNoteMedia);

    const body = document.createElement("div");
    body.className = "form-group my-2";
    const bodyLabel = document.createElement("label");
    bodyLabel.innerHTML = "Post Text:";
    const postBody = document.createElement("input");
    postBody.type = "textarea";
    postBody.className = "form-control";
    postBody.id = "postBody";
    body.append(bodyLabel);
    body.append(postBody);

    const submitNew =  document.createElement("button");
    submitNew.type = "submit";
    submitNew.id = "submitNew";
    submitNew.className = "btn btn-light w-100 btn-lg my-2 mb-5";
    submitNew.innerHTML = "Submit New";
    submitNew.addEventListener("click", (e) => {newPost();});

    form.append(title);
    form.append(date);
    form.append(media);
    form.append(body);
    form.append(submitNew);

    post.append(form);

}

/**
 * function to populate the page with a form to edit an existing post, the form is populated with data retrieved from the RESTAPI call coresponding to the post id 
 * @param {JSON} jsonReturn the json returned from the API call attempt with data on this specific post
 */
function setPostEdit(jsonReturn){
    const post = document.getElementById("singlePost");
    const form = document.createElement("form");
    form.className = "need-validation";
    form.addEventListener('submit', (e) => {e.preventDefault();});
    form.onkeydown = "return event.key != 'Enter';";

    const title = document.createElement("div");
    title.className = "form-group my-2";
    const titleLabel = document.createElement("label");
    titleLabel.innerHTML = "Post Title:";
    const postTitle = document.createElement("input");
    postTitle.type = "text";
    postTitle.className = "form-control";
    postTitle.id= "postTitle";
    postTitle.required = true;
    postTitle.value = jsonReturn.title;
    title.append(titleLabel);
    title.append(postTitle);

    const media = document.createElement("div");
    media.className = "form-group my-2";
    const mediaLabel = document.createElement("label");
    mediaLabel.innerHTML = "Media images:";
    const postMedia = document.createElement("input");
    postMedia.type = "text";
    postMedia.className = "form-control";
    postMedia.id= "postMedia";
    postMedia.value = jsonReturn.media;
    const postNoteMedia = document.createElement("small");
    postNoteMedia.className = "form-text text-muted";
    postNoteMedia.innerHTML = "Add media images to your auction listing by adding image URLs sepertaed by commas (example: https://url.com/image1.jpg, https://url.com/image2.jpg,...,https://url.com/image3.jpg)(optional)";
    media.append(mediaLabel);
    media.append(postMedia);
    media.append(postNoteMedia);

    const body = document.createElement("div");
    body.className = "form-group my-2";
    const bodyLabel = document.createElement("label");
    bodyLabel.innerHTML = "Post Text:";
    const postBody = document.createElement("input");
    postBody.type = "textarea";
    postBody.className = "form-control";
    postBody.id = "postBody";
    postBody.value = jsonReturn.description;
    body.append(bodyLabel);
    body.append(postBody);

    const submitEdit =  document.createElement("button");
    submitEdit.type = "submit";
    submitEdit.id = "submitEdit";
    submitEdit.className = "btn btn-light w-100 btn-lg my-2 mb-5";
    submitEdit.innerHTML = "Submit Edits";
    submitEdit.addEventListener("click", (e) => {editPost(id);});

    form.append(title);
    form.append(media);
    form.append(body);
    form.append(submitEdit);

    post.append(form);

}

/**
 * function to populate the page with data retrieved from the RESTAPI call coresponding to the post id 
 * @param {JSON} jsonReturn the json returned from the API call attempt with data on this specific post
 */
function setPostView(jsonReturn){
    const post = document.getElementById("singlePost");
    const card = document.createElement("div");
    card.className = "card my-2";
    
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    const postTitle = document.createElement("h4");
    postTitle.innerHTML = jsonReturn.title;
    cardHeader.append(postTitle);
    const postOwner = document.createElement("a");
    postOwner.href = "../profile/index.html?user="+jsonReturn.seller.name;
    postOwner.innerHTML = "Created by "+jsonReturn.seller.name;
    cardHeader.append(postOwner);
    const postDate = document.createElement("p");
    postDate.innerHTML = "Expires: " + new Date(jsonReturn.endsAt).toLocaleDateString("en-UK");
    cardHeader.append(postDate);
    card.append(cardHeader);
    
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    const postCarousel = addImageCarousel(cardBody, jsonReturn.media);
    cardBody.append(postCarousel);
    const postBody = document.createElement("p");
    postBody.className = "card-text my-4";
    postBody.innerHTML = "Description: <br>"+jsonReturn.description;
    cardBody.append(postBody);
    const postBids = addBids(cardBody, jsonReturn.bids);
    cardBody.append(postBids);
    
    card.append(cardBody);
    post.append(card); 
}

function addBids(cardBody, bidslist){
    const bids = document.createElement("p");
    bids.className = "";
    bids.innerHTML = "Bids:";
    bidslist.forEach(element => {
        const bid = document.createElement("p");
        bid.className = "";
        bid.innerHTML = element.amount + " credit(s) by " + element.bidderName + " on " + new Date(element.created).toLocaleDateString("en-UK");
        bids.append(bid);
    });

    return bids;
}


/**
 * function to populate a caruosel with images from media table of a listing post 
 * @param {object} cardBody a reference to where the carousel is to be placed
 * @param {Array} media an array of media URLs 
 */
function addImageCarousel(cardBody, media){
    const carousel = document.createElement("div");
    carousel.id = "carouselControls"
    carousel.className = "carousel slide";
    carousel.setAttribute('data-bs-ride', "carousel");
    const carouselInner = document.createElement("div");
    carouselInner.className = "carousel-inner";
    for(let i=0; i<media.length; i++){
        const carouselItem = document.createElement("div");
        if(i==0){
            carouselItem.className = "carousel-item active";
        }
        else{
            carouselItem.className = "carousel-item";
        }
        const carouselImage = document.createElement("img");
        carouselImage.className = "d-block w-100";
        carouselImage.src = media[i];
        carouselItem.append(carouselImage);
        carouselInner.append(carouselItem);
    }
    carousel.append(carouselInner);
    carousel.innerHTML += "<button class='carousel-control-prev' data-bs-target='#carouselControls' data-bs-slide='prev' type='button'> <span class='carousel-control-prev-icon' aria-hidden='true'></span><span class='visually-hidden'>Previous</span></button>"
    carousel.innerHTML += "<button class='carousel-control-next' data-bs-target='#carouselControls' data-bs-slide='next' type='button'> <span class='carousel-control-next-icon' aria-hidden='true' ></span><span class='visually-hidden'>Next</span></button>"
    return carousel;
}


const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
const edit = params.get("edit");
const newEntry = params.get("new");

getPost(id);

