import{postGet, postEdit, postNew} from "../RESTAPI_module.mjs";

/**
 * function to get a specific post, based on the request you will get a new post adding view, or an edit option or simply view option for the post
 * @param {number} id identified of the post 
 */
async function getPost(id){
    try {
        const token = localStorage.getItem('accessToken');
        if(token==null){
            document.location.href = '/index.html';
        }else{
            if(newEntry==="true"){
                setPostNew();
            }
            else{
                const response = await postGet(id, token);
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
            document.location.href = '/index.html';
        }else{
            const response = await postEdit(id, token);
            const jsonReturn = await response.json();
            if(response.ok){
                document.location.href = '/profile/index.html';
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
            document.location.href = '/index.html';
        }else{
            const response = await postNew(token);
            const jsonReturn = await response.json();
            if(response.ok){
                document.location.href = '/profile/index.html';
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
    submitNew.type = "button";
    submitNew.id = "submitNew";
    submitNew.className = "btn btn-light w-100 btn-lg my-2 mb-5";
    submitNew.innerHTML = "Submit New";
    submitNew.addEventListener("click", (e) => {newPost();});

    form.append(title);
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
    form.onkeydown = "return event.key != 'Enter';";

    const title = document.createElement("div");
    title.className = "form-group my-2";
    const titleLabel = document.createElement("label");
    titleLabel.innerHTML = "Post Title:";
    const postTitle = document.createElement("input");
    postTitle.type = "text";
    postTitle.className = "form-control";
    postTitle.id= "postTitle";
    postTitle.value = jsonReturn.title;
    title.append(titleLabel);
    title.append(postTitle);

    const body = document.createElement("div");
    body.className = "form-group my-2";
    const bodyLabel = document.createElement("label");
    bodyLabel.innerHTML = "Post Text:";
    const postBody = document.createElement("input");
    postBody.type = "textarea";
    postBody.className = "form-control";
    postBody.id = "postBody";
    postBody.value = jsonReturn.body;
    body.append(bodyLabel);
    body.append(postBody);

    const submitEdit =  document.createElement("button");
    submitEdit.type = "button";
    submitEdit.id = "submitEdit";
    submitEdit.className = "btn btn-light w-100 btn-lg my-2 mb-5";
    submitEdit.innerHTML = "Submit Edit";
    submitEdit.addEventListener("click", (e) => {editPost(id);});

    form.append(title);
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
    const postOwner = document.createElement("p");
    postOwner.innerHTML = "posted by "+jsonReturn.author.name + " on " + new Date(jsonReturn.updated);
    cardHeader.append(postOwner);
    card.append(cardHeader);
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    const postBody = document.createElement("p");
    postBody.className = "card-text";
    postBody.innerHTML = jsonReturn.body;
    cardBody.append(postBody);
    card.append(cardBody);
    post.append(card); 
}

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
const edit = params.get("edit");
const newEntry = params.get("new");

getPost(id);

