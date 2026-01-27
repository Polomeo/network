document.addEventListener('DOMContentLoaded', function () {
    // Navigation Buttons

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
        console.log(posts);
    });
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
