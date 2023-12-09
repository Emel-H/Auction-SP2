import{profileInfo, postDelete} from "../RESTAPI_module.mjs";

/**
 * function to attempt to get a user profile, if the response is ok from the API the user information is then populated in various sections on the profile page
 * @param {string} username the username of the profile to be retrieved 
 */
async function getProfile(username){
    try {
        const token = localStorage.getItem('accessToken');
        if(token==null){
            document.location.href = '/index.html';
        }else{
            const response = await profileInfo(username,token);
            const jsonReturn = await response.json();
            
            if(response.ok){
                getProfileName(jsonReturn);
                getProfileAvatar(jsonReturn);
                getProfileEmail(jsonReturn);
                getProfileFollowers(jsonReturn);
                getProfileFollowing(jsonReturn);
                getProfilePosts(jsonReturn);
            }
        }
    }
    catch (error) {
        // catches errors both in fetch and response.json
        console.log(error);
    }
}

/**
 * function to delete a post
 * @param {number} id identifier of the post to be deleted 
 */
async function deletePost(id){
    try {
        const token = localStorage.getItem('accessToken');
        if(token==null){
            document.location.href = '/index.html';
        }else{
            const response = await postDelete(id, token);
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
 * function to populate the profile name
 * @param {JSON} jsonReturn the json returned from the API call attempt 
 */
function getProfileName(jsonReturn){
    const profileName = document.getElementById("profileName");
    profileName.innerHTML = jsonReturn.name;
}

/**
 * function to populate the profile image/avatar
 * @param {JSON} jsonReturn the json returned from the API call attempt 
 */
function getProfileAvatar(jsonReturn){
    const profileImage = document.getElementById("profileImage");
    if(jsonReturn.avatar !=null){
        profileImage.src = jsonReturn.avatar;
    }
    else{
        profileImage.src = "/images/profile.png";
    }
}

/**
 * function to populate the profile email
 * @param {JSON} jsonReturn the json returned from the API call attempt 
 */
function getProfileEmail(jsonReturn){
    const profileEmail = document.getElementById("profileEmail");
    profileEmail.innerHTML = jsonReturn.email;
}

/**
 * function to populate the profile followers by itterating over the list 
 * @param {JSON} jsonReturn the json returned from the API call attempt 
 */
function getProfileFollowers(jsonReturn){
    const followers = document.getElementById("profileFollowers");
    const profileFollowers = jsonReturn.followers;
    profileFollowers.forEach(element => {
        const followerlink = document.createElement("a");
        followerlink.href = "/profile/index.html?user="+element.name;
        const followerImg = document.createElement("img");
        followerImg.className = "img-fluid img-thumbnail my-2 w-100";
        if(element.avatar != null){
            followerImg.src = element.avatar
        }
        else{
            followerImg.src = "/images/profile.png";
        }
        followerImg.alt = "profile image "+element.name;
        followerlink.append(followerImg);
        followers.append(followerlink);
    });
}

/**
 * function to populate the profile followering by itterating over the list 
 * @param {JSON} jsonReturn the json returned from the API call attempt 
 */
function getProfileFollowing(jsonReturn){
    const following = document.getElementById("profileFollowing");
    const profileFollowing = jsonReturn.following;
    profileFollowing.forEach(element => {
        const followinglink = document.createElement("a");
        followinglink.href = "/profile/index.html?user="+element.name;
        const followingImg = document.createElement("img");
        followingImg.className = "img-fluid img-thumbnail my-2 w-100";
        if(element.avatar != null){
            followingImg.src = element.avatar
        }
        else{
            followingImg.src = "/images/profile.png";
        }
        followingImg.alt = "profile image "+element.name;
        followinglink.append(followingImg);
        following.append(followinglink);
    });
}

/**
 * function to populate the profile posts by itterating over the list. if this happens to by posts by the logged in user, edit and delete options are added in the form of buttons  
 * @param {JSON} jsonReturn the json returned from the API call attempt 
 */
function getProfilePosts(jsonReturn){
    const posts = document.getElementById("profilePosts");
    const addPostButton = document.getElementById("addPostButton");
    const profilePosts = jsonReturn.posts;
    profilePosts.forEach(element => {
        const card = document.createElement("div");
        card.className = "card my-2";
        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header";
        const postTitle = document.createElement("h4");
        postTitle.innerHTML = element.title;
        cardHeader.append(postTitle);
        const postOwner = document.createElement("p");
        postOwner.innerHTML = "posted by "+element.owner + " on " + new Date(element.updated);
        cardHeader.append(postOwner);
        card.append(cardHeader);
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
        const postBody = document.createElement("p");
        postBody.className = "card-text";
        postBody.innerHTML = element.body;
        cardBody.append(postBody);
        if(username===localStorage.getItem("username")){
            addPostButton.className = "btn btn-primary w-100 my-2 d-block";
            const edit = document.createElement("a");
            edit.href = "../post/?id="+element.id+"&edit=true";
            edit.className = "btn btn-light";
            edit.innerHTML = "Edit";
            cardBody.append(edit);
            const deleteButton =  document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "btn btn-dark float-end";
            deleteButton.innerHTML = "Delete";
            deleteButton.addEventListener("click", (e) => {deletePost(element.id);});
            cardBody.append(deleteButton);
        }
        card.append(cardBody);
        posts.append(card); 
    });
}

/**
 * function to set which profile will be viewed based on if this is thecurrent users profile or a another user 
 */
function setProfileUser(){
    const queryString = document.location.search;
    const params = new URLSearchParams(queryString);
    const user = params.get("user");
    if(user!=null){
        username = user;
    }
}

let username = localStorage.getItem('username');
setProfileUser();
getProfile(username);