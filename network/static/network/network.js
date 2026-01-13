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
function PostList(props) {

    const [posts, setPosts] = React.useState(null);

    // Get all posts
    if (props.author_id) {
        React.useEffect(() => {
            fetch(`/posts/${props.author_id}`)
                .then(response => response.json())
                .then(data => {
                    //console.log(data);
                    setPosts(data);
                    // return posts
                });
        }, []); // Empty dependecy array for preventing infinite loop by only load once at component rendering
    }
    // Get user specific posts
    else {
        React.useEffect(() => {
            fetch(`/posts/all`)
                .then(response => response.json())
                .then(data => {
                    //console.log(data);
                    setPosts(data);
                    // return posts
                });
        }, []); // Empty dependecy array for preventing infinite loop by only load once at component rendering
    }


    return (
        <div class="col-md-8">
            {posts && posts.map((post) => (
                <PostView key={post.id} username={post.author} created_at={post.created_at} body={post.body} />
            ))}
        </div>
    );
}

//#endregion

//#region FUNCTIONS



//#endregion

function App() {

    return (
        <div>
            <PostList author_id="4" />
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#app'));