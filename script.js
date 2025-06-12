document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".playlist-cards");
    const modal = document.querySelector(".modal-overlay");
    const closeBtn = modal.querySelector(".close-button");
    const modalCover = document.querySelector(".modal-cover");
    const modalTitle = document.querySelector(".modal-playlist-title");
    const modalAuthor = document.querySelector(".modal-playlist-author");
    const songsList = document.querySelector(".songs-list");
    const shuffleButton = document.querySelector(".shuffle-button");

    fetch("data/data.json")
    .then((response) => {
        if (!response.ok) {
        throw new Error("Network error: " + response.status);
        }
        return response.json();
    })
    .then((data) => {
        container.innerHTML = "";
        
        if (data.playlists && data.playlists.length > 0) {
        data.playlists.forEach(createPlaylistCard);
        } else {
        displayNoPlaylistsMessage();
        }
    })
    .catch((err) => {
        console.error("Failed to load playlists:", err);
        displayErrorMessage();
    });

    function createPlaylistCard(playlist) {
    const card = document.createElement("div");
    card.className = "playlist-card";
    
    card.innerHTML = `
        <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}" class="playlist-cover">
        <div class="playlist-info">
        <h3 class="playlist-title">${playlist.playlist_name}</h3>
        <p class="playlist-author">By: ${playlist.playlist_author}</p>
        <div class="like-section">
            <span class="heart-icon">♥</span>
            <span class="like-count">${playlist.likes}</span>
        </div>
        </div>
    `;

    card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("heart-icon")) {
        openModal(playlist);
        }
    });

    const heartIcon = card.querySelector(".heart-icon");
    const likeCount = card.querySelector(".like-count");
    
    heartIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        
      // Get current like count
        let currentLikes = parseInt(likeCount.textContent, 10);
        
        if (heartIcon.classList.contains("liked")) {
        heartIcon.classList.remove("liked");
        likeCount.textContent = --currentLikes;
        } else {
        heartIcon.classList.add("liked");
        likeCount.textContent = ++currentLikes;
        }
    });

    container.appendChild(card);
    }

    function openModal(playlist) {
    window.currentPlaylist = playlist;
    
    // Set the modal content with playlist information
    modalCover.src = playlist.playlist_art;
    modalCover.alt = playlist.playlist_name;
    modalTitle.textContent = playlist.playlist_name;
    modalAuthor.textContent = `By: ${playlist.playlist_author}`;
    
    // Display the songs in order
    updateSongsDisplay(playlist.songs);
    
    modal.classList.add("show");
    }

    function displayNoPlaylistsMessage() {
    const messageDiv = document.createElement("div");
    messageDiv.className = "no-playlists-message";
    messageDiv.innerHTML = `
        <h2>No playlists available</h2>
        <p>Check back later for new playlists!</p>
    `;
    messageDiv.style.textAlign = "center";
    messageDiv.style.padding = "40px";
    messageDiv.style.color = "#666";
    container.appendChild(messageDiv);
    }

  //function to display error message if no available playlists
    function displayErrorMessage() {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
        <h2>Error loading playlists</h2>
        <p>Please try refreshing the page.</p>
    `;
    errorDiv.style.textAlign = "center";
    errorDiv.style.padding = "40px";
    errorDiv.style.color = "#e74c3c";
    container.appendChild(errorDiv);
    }

    closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    });

  // Close modal when clicking outside modal content
    modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
    });

    function shuffleSongs(songsArray) {
    // Create a copy of the original array
    const shuffledSongs = [...songsArray];
    
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const randomIndex = Math.floor(Math.random() * (i + 1));
        
        // Swap elements at current index and random index
        [shuffledSongs[i], shuffledSongs[randomIndex]] = [shuffledSongs[randomIndex], shuffledSongs[i]];
    }
    
    return shuffledSongs;
    }

    function updateSongsDisplay(songs) {
    // Clear the current songs list
    songsList.innerHTML = "";
    
    songs.forEach((song) => {
        const songItem = document.createElement("div");
        songItem.className = "song-item";
        songItem.innerHTML = `
        <span class="song-title">${song.title}</span>
        <span class="song-artist">${song.artist}</span>
        <span class="song-duration">${song.duration}</span>
        `;
        songsList.appendChild(songItem);
    });
    }

    shuffleButton.addEventListener("click", () => {
    // Check if we have a current playlist to shuffle
    if (window.currentPlaylist && window.currentPlaylist.songs) {
        // Shuffle the songs and update the display
        const shuffledSongs = shuffleSongs(window.currentPlaylist.songs);
        updateSongsDisplay(shuffledSongs);
        
        shuffleButton.textContent = "🔀 Shuffled!";
        
        // Reset button
        setTimeout(() => {
        shuffleButton.textContent = "🔀 Shuffle Songs";
        }, 1000);
    }
    });
});