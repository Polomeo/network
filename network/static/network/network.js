//#region VARIABLES

// All posts


//#endregion

//#region COMPONENTS
// POST VIEW COMPONENT
function PostView(props) {
    return (
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">{props.username}</h5>
                <a href="#">Edit post</a>
                <h6 class="card-subtitle mb-3 text-muted">{props.created_at}</h6>
                <p class="card-text">{props.body}</p>
                <a href="#">{props.likes} 0 likes</a>
            </div>
        </div>
    );
}

// POST LIST COMPONENT
function PostList({posts}) {
    return (
        <div class="col-md-8">
            {posts.map((post) => (
                <PostView key={post.id} username={post.author} created_at={post.created_at} body={post.body}/>
            ))}
        </div>
    );
}

//#endregion

//#region FUNCTIONS



//#endregion

function App() {

    // Get all posts
    const [posts, setPosts] = React.useState(null);

    React.useEffect(() => {
            fetch(`/post/all`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                setPosts(data);
                // return posts
                }); 
    }, []); // Empty dependecy array for preventing infinite loop by only load once at component rendering

   // Using "posts && <PostList... />" to load PostList once posts is succesfully fetched
    return (
        <div>
            {posts && <PostList posts = {posts}/>}
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#app'));

document.addEventListener('DOMContentLoaded', function(){
    
    console.log('DOM Content Loaded');
    
    // Buttons

});