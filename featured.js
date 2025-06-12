document.addEventListener("DOMContentLoaded", () => {
    const featuredImage = document.getElementById("featured-image");
    const featuredTitle = document.getElementById("featured-title");
    const featuredAuthor = document.getElementById("featured-author");
    const featuredSongsList = document.getElementById("featured-songs-list");

    fetch("data/data.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network error: " + response.status);
            }
            return response.json();
        })
        .then((data) => {
            if (data.playlists && data.playlists.length > 0) {
                const randomPlaylist = selectRandomPlaylist(data.playlists);
                displayFeaturedPlaylist(randomPlaylist);
            } else {
                displayNoPlaylistsMessage();
            }
        })
        .catch((err) => {
            console.error("Failed to load playlists:", err);
            displayErrorMessage();
        });

    // Function to select a random playlist from the array
    function selectRandomPlaylist(playlists) {
        // Generate a random index between 0 and the length of the playlists array
        const randomIndex = Math.floor(Math.random() * playlists.length);
        
        // Return the playlist at the random index
        return playlists[randomIndex];
    }

    // function to display the selected playlist on the featured page
    function displayFeaturedPlaylist(playlist) {
        // Set the playlist image source and alt text
        featuredImage.src = playlist.playlist_art;
        featuredImage.alt = playlist.playlist_name;
        
        featuredTitle.textContent = playlist.playlist_name;
        featuredAuthor.textContent = `By: ${playlist.playlist_author}`;
        
        // clear  existing songs
        featuredSongsList.innerHTML = "";
        displayFeaturedSongs(playlist.songs);
    }

    // Function to display the songs in the featured playlist
    function displayFeaturedSongs(songs) {
        songs.forEach((song, index) => {
            const songItem = document.createElement("div");
            songItem.className = "featured-song-item";
            
            songItem.innerHTML = `
                <span class="song-number">${index + 1}.</span>
                <div class="song-details">
                    <span class="song-title">${song.title}</span>
                    <span class="song-artist">${song.artist}</span>
                </div>
                <span class="song-duration">${song.duration}</span>
            `;
            
            featuredSongsList.appendChild(songItem);
        });
    }

    // Function to display message when no playlists are available
    function displayNoPlaylistsMessage() {
        // Create error message for the featured page
        const messageDiv = document.createElement("div");
        messageDiv.className = "featured-error-message";
        messageDiv.innerHTML = `
            <h2>No playlists available</h2>
            <p>Check back later for featured playlists!</p>
        `;
        
        // Replace the main content with the error message
        const mainContent = document.querySelector(".featured-main");
        mainContent.innerHTML = "";
        mainContent.appendChild(messageDiv);
    }

    // fucntion to display error message when loading fails
    function displayErrorMessage() {
        // Create error message for loading failures
        const errorDiv = document.createElement("div");
        errorDiv.className = "featured-error-message";
        errorDiv.innerHTML = `
            <h2>Error loading featured playlist</h2>
            <p>Please try refreshing the page.</p>
        `;
        
        const mainContent = document.querySelector(".featured-main");
        mainContent.innerHTML = "";
        mainContent.appendChild(errorDiv);
    }
});