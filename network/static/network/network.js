document.addEventListener('DOMContentLoaded', function (event) {
    // Navigation Buttons
    // At first, the user won't be logged in, so this avoids a crashing error of Null
    try {
        const userIdNumber = document.querySelector("#user-profile").value;
        // console.log(userIdNumber);
        document.querySelector("#user-profile").addEventListener('click', () => {
            loadProfile(Number(userIdNumber));
            // history.pushState({id_number : Number(userIdNumber)}, "", `user/${userIdNumber}`);
        });
    }
    catch (error) {
        console.log("Error getting user-profile. User not logged in.");
        //console.error(error);
    }

    // New post form
    try {
        document.querySelector("#new-post-button").addEventListener('click', () => toggleNewPostForm(true));
        document.querySelector("#cancel-new-post").addEventListener('click', () => toggleNewPostForm(false));
        toggleNewPostForm(false);
        document.querySelector("#new-post-form").addEventListener('submit', newPost);
    }
    catch (error) {
        console.log("Error getting new post form. User not logged in.")
    }

    // Following posts link
    try {
        document.querySelector("#following-posts").addEventListener('click', loadFollowingPosts);
        // console.log("[DEBUG] Hook to #following-posts done.");
    }
    catch (error) {
        console.log("Error setting Following Post hook. User not logged in.")
    }

    // Load all posts page
    // document.querySelector("#all-posts").addEventListener('click', () => loadAllPosts);
    document.querySelector("#all-posts").addEventListener("click", (e) => {loadAllPosts(e, 1)});
    loadAllPosts(event, 1); // Load first page
    // console.log("Loadding page 1")

});

//#region VIEWING POSTS

// Load all the posts in the main page
function loadAllPosts(event, page_number) {

    if(event === "click"){
        event.preventDefault();
        console.log("prevenido default!")
    }

    const following_view = document.querySelector('#posts-view');

    following_view.innerHTML = "<h3>All posts</h3>";

    // Fetch the posts
    fetch(`posts/all/${page_number}`, { cache: 'reload' })
        .then(response => response.json())
        .then(data => {

            // console.log(data.page_info);
            // console.log(data.page_body);

            // Add each post to template
            data.page_body.forEach(element => {
                const loaded_post = createPost(element);
                following_view.append(loaded_post);
                updatePostLikes(element.id);

            });
            
            // Append navigation
            const navigation_links = displayPagination(data.page_info.has_next_page, data.page_info.has_previous_page);
            
            following_view.append(navigation_links);
            
            // Previous page link
            console.log(data.page_info.has_previous_page);

            const paginator = document.getElementById("paginator");

            if (data.page_info.has_previous_page === true) {
                console.log("Has previous page")
                paginator.getElementsByTagName("a")[0].addEventListener("click", (e) => loadAllPosts(e, page_number - 1));
                console.log(`Set Hook to loadAllPost(${page_number - 1})`);
            }
                
            // Next page link
            if (data.page_info.has_next_page === true) {
                console.log("Has next page")
                paginator.getElementsByTagName("a")[1].addEventListener("click", (e) => loadAllPosts(e, page_number + 1));
                console.log(`Set Hook to loadAllPost(${page_number + 1})`);
            }

        });
    
    // Display the all posts page
    showPage('#posts-view');


    // Display the new post form
    document.querySelector("#compose-view").style.display = 'block';

}

function loadFollowingPosts() {
    const following_view = document.querySelector('#following-view');

    following_view.innerHTML = "<h3>Following posts</h3>";

    // Fetch the posts
    fetch(`posts/following_posts`, { cache: 'reload' })
    .then(response => {

    // Since is posible that the response is a redirect to login
    // we evaluate if it's content-type is HTML
        const contentTypeResponse = response.headers.get('content-type');

        if (contentTypeResponse.includes('text/html')) {
            window.location.href = response.url;
            return null;
        }
        // Else, return the JSON response normally
        return response.json();
        })
    .then(data => {
        
        if (data.no_posts){
            console.log("No posts to show.");

        } else {
            // Add each post to template
            data.forEach(element => {
                const loaded_post = createPost(element);
                following_view.append(loaded_post);
                updatePostLikes(element.id);
                })
        };
    });

    // Display the all posts page
    showPage('#following-view');

    // Display the new post form
    // document.querySelector("#compose-view").style.display = 'block';
}

// Returns a div element for a post in the database
function createPost(args) {

    const post_element = document.createElement('div');
    post_element.innerHTML = `<div class="card-body">
            <h5 class="card-title">${args.author}</h5>
            <a href="#">Edit post</a>
            <h6 class="card-subtitle mb-3 text-muted">${args.created_at}</h6>
            <p class="card-text">${args.body}</p>
            <i class="bi bi-heart"></i> <a href="#" class="like-link">0</a>
            </div>`;
    // Styling
    post_element.setAttribute('class', 'card mb-3 post-element');
    post_element.setAttribute('data-postid', String(args.id));

    // Hooks
    const cardTitleElement = post_element.getElementsByClassName("card-title");
    cardTitleElement[0].addEventListener('click', () => loadProfile(args.author_id));

    const likeLink = post_element.getElementsByClassName("like-link");
    likeLink[0].addEventListener('click', (event) => likePost(event, args.id));

    return post_element;

}
//#endregion

//#region CREATING POSTS
/// CREATING POSTS ///
function toggleNewPostForm(visible) {
    if (visible) {
        document.querySelector("#new-post-button").style.display = 'none';
        document.querySelector("#new-post-form").style.display = 'block';
        console.log("New post form visible");
    }
    else {
        document.querySelector("#new-post-button").style.display = 'block';
        document.querySelector("#new-post-form").style.display = 'none';
        console.log("New post form invisible");
    }
}

function newPost(event) {
    console.log('Trying to send post');

    // Prevent automatic reload of the page
    event.preventDefault();

    // Get the data
    const post_body = document.querySelector('#new-post-body').value.toString();

    // Try to send the post
    fetch('/posts/new', {
        method: 'POST',
        body: JSON.stringify({
            body: post_body,
        })
    })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                console.log('Error: ', result.error);
            }
            else {
                console.log('Result: ', result);
                // Reloads all posts
                loadAllPosts();
                // Hide the form
                toggleNewPostForm(false);
                // Set the post body blank
                document.querySelector('#new-post-body').value = "";
            }
        })
        .catch(error => {
            console.log('Error: ', error);
        });
}
//#endregion

//#region USER PROFILE
// Load user profile with it's own posts in reverse chron. 
function loadProfile(userId) {
    const profile_posts = document.querySelector('#profile-posts');
    const profile_avatar = document.querySelector('#profile-avatar');

    // First we clean the contents of each section
    profile_posts.innerHTML = "";
    profile_avatar.innerHTML = "";

    console.log(`Profile User ID: ${userId}`);

    // Fetch the posts
    fetch(`posts/${userId}`, { cache: 'reload' })
        .then(response => response.json())
        .then(posts => {

            // Log the posts [DEBUG]
            // console.log(posts);

            // If there are no posts
            if (posts.no_posts) {
                const noPostMessage = document.createElement('h3');
                noPostMessage.innerHTML = "This user has not posted yet."
                profile_posts.insertAdjacentElement('beforeend', noPostMessage);
                return
            }

            const profile_content = createAvatar(String(posts[0].author), userId);
            profile_avatar.append(profile_content);
            updateFollowers(userId);
            updateFollowings(userId);

            // Add each post to template
            posts.forEach(element => {
                const loaded_post = createPost(element);
                profile_posts.append(loaded_post);
                updatePostLikes(element.id);

            });
        });

    // Display profile page
    showPage('#profile-view');
}

// Follows the current user
function followUser(event, profileUserId) {

    // Prevents default URL #
    event.preventDefault();
       
    fetch(`posts/follow/${profileUserId}`, {
        method: 'POST',
    })
    .then(response => {

        // Since is posible that the response is a redirect to login
        // we evaluate if it's content-type is HTML
        const contentTypeResponse = response.headers.get('content-type');

        if (contentTypeResponse.includes('text/html')) {
            window.location.href = response.url;
            console.log("Response redirected!");
            return null;
        }
        // Else, return the JSON response normally
        return response.json();
    })
    .then(result => {
        if (!result) return;

        if(result.followed){
            console.log("User is now following.")
            updateFollowers(profileUserId);
        }
        else if (result.unfollowed){
            console.log("User is no longer following.")
            updateFollowers(profileUserId);
        }
    })
    .catch(error => {
        console.log('Error: ', error);
    });

}

// Returns a div element for the user profile avatar
function createAvatar(username, profileUserId) {

    const profileAvatar = document.createElement('div');
    profileAvatar.innerHTML = `<div class="card-body">
        <h5 class="card-title">${username.charAt(0).toUpperCase() + username.slice(1)}</h5>
        <p class="card-text"><span id="followers" class="followers">0</span> followers</p>
        <p class="card-text"><span id="following" class="following">0</span> following</p>
        <a id="follow-link" href="#" class="btn btn-primary" value="${profileUserId}">Follow</a>
    </div>`;

    // Styling
    profileAvatar.setAttribute('id', 'profile-avatar');
    profileAvatar.setAttribute('class', 'card text-center w-75 mb-3');

    // Hook
    const followLink = profileAvatar.getElementsByTagName("a")[0];
    followLink.addEventListener('click', (event) => followUser(event, profileUserId));

    return profileAvatar
}

function updateFollowers(profileUserId) {
    // Updates all follower related visuals and checks

    let currentUserId = 0
    let userIsFollowing = false;
    let followerCount = 0;

    try {
        const currentUserIdValue = document.querySelector("#user-profile").value;
        currentUserId = Number(currentUserIdValue);
    }
    catch (error) {
        console.log("User not logged in.");
    }

    // Fetch the profile followers
    fetch(`posts/followers/${profileUserId}`, { cache: 'reload' })
        .then(response => response.json())
        .then(followers => {
            if (followers.no_followers) {
                console.log(followers.no_followers);
            }
            else {
                followers.forEach(element => {
                    followerCount++;
                    console.log("Follower count: " + String(followerCount));

                    // Check if the current user already follows this profile
                    if (element['follower_id'] == currentUserId) {
                        userIsFollowing = true;
                        console.log("The user is already following this profile.");
                    }
                })
            }
            // Set the followers number
            console.log("Setting followers number...");
            document.querySelector("#followers").innerHTML = String(followerCount);

            // Set the follow button
            console.log("Setting follow button...");
            document.querySelector("#follow-link").innerHTML = userIsFollowing ? "Unfollow" : "Follow";
        });
}

function updateFollowings(profileUserId) {

    followingCount = 0;

    fetch(`posts/following/${profileUserId}`, { cache: 'reload' })
        .then(response => response.json())
        .then(following => {
            if (following.no_followings) {
                console.log(following.no_followings);
            }
            else {
                following.forEach(element => {
                    followingCount++;
                    console.log(element);
                })
            }

            // Set the following count
            console.log("Setting following count...");
            document.querySelector("#following").innerHTML = String(followingCount);
        });
}


//#endregion

function displayPagination(hasNext, hasPrev) {
    
    const navigation_element = document.createElement('nav');
    navigation_element.innerHTML = `
        <ul class="pagination justify-content-center">
            <li class="page-item">
                <a class="page-link" href="#">Previous</a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#">Next</a>
            </li>
        </ul>
        `;
    
    navigation_element.setAttribute('aria-label', "Pagination");
    navigation_element.setAttribute('id', "paginator");

    // If has no prev page, disable the button
    if (!hasPrev) {
        navigation_element.getElementsByClassName("page-item")[0].setAttribute("tabindex", "-1");
        navigation_element.getElementsByClassName("page-item")[0].setAttribute("class", "page-item disabled");
    }
    // If has no next page, disable the button
    if (!hasNext) {
        navigation_element.getElementsByClassName("page-item")[1].setAttribute("tabindex", "-1");
        navigation_element.getElementsByClassName("page-item")[1].setAttribute("class", "page-item disabled");
    } 
    
    // Else, return paginator with no links



    return navigation_element;




}


//#region LIKING POSTS
function likePost(event, postToLikeId) {
    
    // Prevents default URL #
    event.preventDefault();
       
    fetch(`posts/like/${postToLikeId}`, {
        method: 'POST',
    })
    .then(response => {

        // Since is posible that the response is a redirect to login
        // we evaluate if it's content-type is HTML
        const contentTypeResponse = response.headers.get('content-type');

        if (contentTypeResponse.includes('text/html')) {
            window.location.href = response.url;
            return null;
        }
        // Else, return the JSON response normally
        return response.json();
    })
    .then(result => {
        if (!result) return;

        if(result.liked){
            console.log("User now likes this post.");
            updatePostLikes(postToLikeId);
        }
        else if (result.unliked){
            console.log("User no longer likes this post.");
            updatePostLikes(postToLikeId);
        }
    })
    .catch(error => {
        console.log('Error: ', error);
    });
}

function updatePostLikes(postId) {

    let likesCount = 0;
    let currentUserId = 0;
    let userLikesThisPost = false;

    try {
        const currentUserIdValue = document.querySelector("#user-profile").value;
        currentUserId = Number(currentUserIdValue);
    }
    catch (error) {
        console.log("User not logged in.");
    }

    fetch(`posts/get_likes/${postId}`, { cache: 'reload' })
        .then(response => response.json())
        .then(likes => {
            if (likes.no_likes) {
                //console.log(likes.no_likes);
            }
            else {
                likes.forEach(element => {
                    likesCount++;
                    if (element.liked_by_id == currentUserId){
                        userLikesThisPost = true;
                    }
                })
            }

            const postDivs = document.querySelectorAll(".post-element");

            postDivs.forEach(element => {
                if (element.dataset.postid == String(postId)){
                    element.getElementsByClassName("like-link")[0].innerHTML = String(likesCount);
                    if (userLikesThisPost){
                        element.getElementsByTagName("i")[0].setAttribute("style", "color:red;");
                    }
                    else{
                        element.getElementsByTagName("i")[0].removeAttribute("style");
                    }
                }
            });
        });
}
//#endregion

//#region UTILITARY FUNCTIONS
function showPage(page) {
    // Hide all pages
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';

    // Show selected page
    document.querySelector(page).style.display = 'block';
}
//#endregion