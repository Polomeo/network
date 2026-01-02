// Post Component
function PostView(props) {
    return (
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">{props.username}</h5>
                <a href="#">Edit post</a>
                <h6 class="card-subtitle mb-2 text-muted">timestamp</h6>
                <p class="card-text">{props.body}</p>
                <a href="#">{props.likes} likes</a>
            </div>
        </div>
    );
}

// Post List Component
function PostList({posts}) {
    return (
        <div class="col-md-8">
            {posts.map((post) => (
                <PostView key={post.id} username={post.author} body={post.body}/>
            ))}
        </div>
    );
}

function App() {

   const [posts, setPosts] = React.useState(null);

   React.useEffect(() => {
        fetch(`/post/all`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setPosts(data);
            // return posts
            }); 
   }, []); // Empty dependecy array for preventing infinite loop


    return (
        <div>
            {posts && <PostList posts = {posts}/>}
        </div>
        // <div class="col-md-8">
        //     <PostView username="Harry" body="Hello world! Going to fight a Dragon!" likes="0"/>
        //     <PostView username="Ron" body="Viktor Krum is the best!" likes="2"/>
        //     <PostView username="Hermione" body="Adivination is a very unreliable magic..." likes="5"/>
        // </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#app'));