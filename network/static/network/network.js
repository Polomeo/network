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
    document.querySelector("#new-post-button").addEventListener('click', () => toggleNewPostForm(true));
    document.querySelector("#cancel-new-post").addEventListener('click', () => toggleNewPostForm(false));
    toggleNewPostForm(false);
    
    // Load all posts page
    document.querySelector("#all-posts").addEventListener('click', () => loadAllPosts);
    loadAllPosts();

});

/// VIEWING POSTS ///

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
}

// Load user profile with it's own posts in reverse chron. 
function loadProfile(userId){
    const posts_view = document.querySelector('#profile-view');

    // First we clean the contents of the section
    posts_view.innerHTML = "";

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
            posts_view.insertAdjacentElement('beforeend', noPostMessage);
            return
        }

        const profile_title = document.createElement('h3');
        profile_title.innerHTML = `<h3>${String(posts[0].author).charAt(0).toUpperCase() + String(posts[0].author).slice(1)}'s posts</h3>`;
        posts_view.append(profile_title);
        
        // Add each post to template
        posts.forEach(element => {
            const loaded_post = createPost(element);
            posts_view.append(loaded_post);
            
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

/// UTILITARY FUNCTIONS ////
function showPage(page) {
    // Hide all pages
    //document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';

    // Show selected page
    document.querySelector(page).style.display = 'block';
}
