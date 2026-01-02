// Post component
function PostView(props) {
    return (
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">{props.username}</h5>
                <a href="#">Edit post</a>
                <h6 class="card-subtitle mb-2 text-muted">timestamp</h6>
                <p class="card-text">{props.message}</p>
                <a href="#">{props.likes} likes</a>
            </div>
        </div>
    );
}

function fetch_posts(username) {
    fetch(`/post/${username}`)
    .then(response => response.json())
    .then(posts => {
        // Posts
        console.log(posts);
    });

}


function App() {
    
    fetch_posts("sarasa")

    return (
        <div class="col-md-8">
            <PostView username="Harry" message="Hello world! Going to fight a Dragon!" likes="0"/>
            <PostView username="Ron" message="Viktor Krum is the best!" likes="2"/>
            <PostView username="Hermione" message="Adivination is a very unreliable magic..." likes="5"/>
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#app'));