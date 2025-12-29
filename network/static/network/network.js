function PostView(props) {
    return (
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">{props.username}</h5>
                <a href="#">Edit post</a>
                <h6 class="card-subtitle mb-2 text-muted">timestamp</h6>
                <p class="card-text">{props.message}</p>
                <a href="#">0 likes</a>
            </div>
        </div>
    );
}

function App() {
    return (
        <div class="col-md-8">
            <PostView username="Harry" message="Hello world! Going to fight a Dragon!" />
            <PostView username="Ron" message="Viktor Krum is the best!" />
            <PostView username="Hermione" message="Adivination is a very unreliable magic..." />
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#app'));