document.addEventListener('DOMContentLoaded', function () {
    // Navigation Buttons
    try {
        document.querySelector("#user-profile").addEventListener('click', () => load_profile(4));
    }
    catch(error) {
        console.log("Error getting user-profile link. User not logged in.");
        //console.error(error);
    }
    document.querySelector("#all-posts").addEventListener('click', () => load_all_posts);

    // Load all posts page
    load_all_posts();

});

function load_all_posts()
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
            
            // Create the elements
            // const post_element = document.createElement('div');
            // post_element.innerHTML = `<div class="card-body">
            // <h5 class="card-title">${element.author}</h5>
            // <a href="#">Edit post</a>
            // <h6 class="card-subtitle mb-3 text-muted">${element.created_at}</h6>
            // <p class="card-text">${element.body}</p>
            // <a href="#">{props.likes} 0 likes</a>
            // </div>`;
            // post_element.setAttribute('class', 'card mb-3');
            const loaded_post = createPost(element);
            posts_view.append(loaded_post);         
            
        });
    });
    
    // Display the all posts page
    show_page('#posts-view');
}

function load_profile(userId){
    const posts_view = document.querySelector('#profile-view');
    
    
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
            
            // Create the elements
            // const post_element = document.createElement('div');
            // post_element.innerHTML = `<div class="card-body">
            // <h5 class="card-title">${element.author}</h5>
            // <a href="#">Edit post</a>
            // <h6 class="card-subtitle mb-3 text-muted">${element.created_at}</h6>
            // <p class="card-text">${element.body}</p>
            // <a href="#">{props.likes} 0 likes</a>
            // </div>`;
            // posts_view.append(post_element);
            const loaded_post = createPost(element);
            posts_view.append(loaded_post);
            
            // Styling
            post_element.setAttribute('class', 'card mb-3');
            
        });
    }); 

    // Display profile page
    show_page('#profile-view');
}

// Returns a post div element
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

    return post_element;

}

// Utilitary functions
function show_page(page) {
    // Hide all pages
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';

    // Show selected page
    document.querySelector(page).style.display = 'block';
}

// function PostView(props) {
//     return (
//         <div class="card mb-3">
//             <div class="card-body">
//                 <h5 class="card-title">{props.username}</h5>
//                 <a href="#">Edit post</a>
//                 <h6 class="card-subtitle mb-3 text-muted">{props.created_at}</h6>
//                 <p class="card-text">{props.body}</p>
//                 <a href="#">{props.likes} 0 likes</a>
//             </div>
//         </div>
//     );
// }
