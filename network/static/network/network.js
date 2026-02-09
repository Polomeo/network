document.addEventListener('DOMContentLoaded', function () {
    // Navigation Buttons
    // At first, the user won't be logged in, so this avoids a crashing error of Null
    try {
        const userIdNumber = document.querySelector("#user-profile").value;
        console.log(userIdNumber);
        document.querySelector("#user-profile").addEventListener('click', () => loadProfile(Number(userIdNumber)));
    }
    catch(error) {
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
    catch(error) {
        console.log("Error getting new post form. User not logged in.")
    }

    
    // Load all posts page
    document.querySelector("#all-posts").addEventListener('click', () => loadAllPosts);
    loadAllPosts();

});

//#region VIEWING POSTS

// Load all the posts in the main page
function loadAllPosts()
{
    const posts_view = document.querySelector('#posts-view');

    posts_view.innerHTML = "<h3>All posts</h3>";

    // Fetch the posts
    fetch("posts/all", {cache: 'reload'})
    .then(response => response.json())
    .then(posts => {
        
        // Log the posts [DEBUG]
        console.log(posts);
        
        // Add each post to template
        posts.forEach(element => {
            const loaded_post = createPost(element);
            posts_view.append(loaded_post);         
            
        });
    });
    
    // Display the all posts page
    showPage('#posts-view');

    // Display the new post form
    document.querySelector("#compose-view").style.display = 'block';
}

// Load user profile with it's own posts in reverse chron. 
function loadProfile(userId){
    const profile_posts = document.querySelector('#profile-posts');
    const profile_avatar = document.querySelector('#profile-avatar');

    // First we clean the contents of each section
    profile_posts.innerHTML = "";
    profile_avatar.innerHTML = "";

    console.log(`User ID: ${userId}`);
    
    // Fetch the posts
    fetch(`posts/${userId}`, {cache: 'reload'})
    .then(response => response.json())
    .then(posts => {
        
        // Log the posts [DEBUG]
        console.log(posts);

        // If there are no posts
        if (posts.no_posts) {
            const noPostMessage = document.createElement('h3');
            noPostMessage.innerHTML = "This user has not posted yet."
            profile_posts.insertAdjacentElement('beforeend', noPostMessage);
            return
        }

        // User name
        // const profile_title = document.createElement('h3');
        // profile_title.innerHTML = `<h3>${String(posts[0].author).charAt(0).toUpperCase() + String(posts[0].author).slice(1)}</h3>`;
        // profile_avatar.append(profile_title);

        const profile_content = createAvatar(String(posts[0].author));
        profile_avatar.append(profile_content);
        
        // Add each post to template
        posts.forEach(element => {
            const loaded_post = createPost(element);
            profile_posts.append(loaded_post);
            
        });
    }); 

    // Display profile page
    showPage('#profile-view');
}

// Returns a div element for a post in the database
function createPost(args) {
    
    const post_element = document.createElement('div');
    post_element.innerHTML = `<div class="card-body">
            <h5 class="card-title">${args.author}</h5>
            <a href="#">Edit post</a>
            <h6 class="card-subtitle mb-3 text-muted">${args.created_at}</h6>
            <p class="card-text">${args.body}</p>
            <a href="#">{props.likes} 0 likes</a>
            </div>`;
    // Styling
    post_element.setAttribute('class', 'card mb-3');

    // Hooks
    const cartTitleElement = post_element.getElementsByClassName("card-title");
    cartTitleElement[0].addEventListener('click', () => loadProfile(args.author_id));

    return post_element;

}

// Returns a div element for the user profile avatar
function createAvatar(username) {
    const profile_avatar = document.createElement('div');
    profile_avatar.innerHTML = `<div class="card-body">
        <h5 class="card-title">${username.charAt(0).toUpperCase() + username.slice(1)}</h5>
        <p class="card-text">X followers</p>
        <p class="card-text">X following</p>
        <a href="#" class="btn btn-primary">Follow</a>
    </div>`;

    // Styling
    profile_avatar.setAttribute('class', 'card text-center w-75 mb-3');

    return profile_avatar
}

//#endregion

//#region CREATING POSTS
/// CREATING POSTS ///
function toggleNewPostForm(visible){
    if(visible){
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

function newPost(event){
    console.log('Trying to send post');

    // Prevent automatic reload of the page
    event.preventDefault();

    // Get the data
    const post_body = document.querySelector('#new-post-body').value.toString();

    // Try to send the post
    fetch('/posts/new', {
        method: 'POST',
        body : JSON.stringify({
            body : post_body,
        })
    })
    .then(response => response.json())
    .then(result => {
        if(result.error) {
            console.log('Error: ', result.error);
        }
        else {
            console.log('Result: ', result);
            // Reloads all posts
            loadAllPosts();
            // Hide the form
            toggleNewPostForm(false);
        }
    })
    .catch(error => {
        console.log('Error: ', error);
    });
}
//#endregion

//#region UTILITARY FUNCTIONS
function showPage(page) {
    // Hide all pages
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';

    // Show selected page
    document.querySelector(page).style.display = 'block';
}
//#endregion