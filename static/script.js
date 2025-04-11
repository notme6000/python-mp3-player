const button = document.getElementById("toggleplaypause");
const img = document.getElementById("playpausebutton");

const playimage = "play.png";
const pauseimage = "pause.png";

button.addEventListener("click", () => {
	img.src = img.src.includes(pauseimage) ? playimage : pauseimage;
});

let playlist = [];
let currentTrack = 0;


function initializePlayer() {
    if (window.pywebview && typeof window.pywebview.api !== 'undefined') {
        window.pywebview.api.get_playlist().then(response => {
            playlist = JSON.parse(response);
            console.log("playlist on startup:", playlist);
            if (playlist.length > 0) {
                currentTrack = 0;
                updateTrackInfo();
            } else {
                document.getElementById("track-info").value = "no mp3 files found. select a folder.";
            }
        }).catch(err => {
            console.error("Error getting playlist:", err);
            document.getElementById("track-info").value = "Error loading playlist";
        });
    } else {
        console.log("pywebview API not ready, retrying in 100ms");
        setTimeout(initializePlayer, 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();
});

function openFolder() {
	window.pywebview.api.open_folder().then(response => {
		playlist = JSON.parse(response);
		if (playlist.length > 0) {
			document.getElementById("track-info").value = "Loaded " + playlist.length + " songs.";
			currentTrack = 0;
		} else {
			document.getElementById("track-info").value = "no mp3 files found.";
		}
	});
}

function updateCurrentTrack(index) {
	currentTrack = index;
	updateTrackInfo();
}

function playPause() {
	window.pywebview.api.play_pause().then(isPlaying => {
		console.log("playlist : ", playlist);
		console.log("currenttrack: ", currentTrack);
		console.log("track name : ", getTrackName(currentTrack));
		document.getElementById("track-info").value = isPlaying ? "playing : " + getTrackName(currentTrack) : "paused";
	});
}

function nextTrack() {
	window.pywebview.api.next_track().then(trackIndex => {
		currentTrack = trackIndex;
		document.getElementById("track-info").value = "playing : " + getTrackName(currentTrack) ;
	});
}

function prevTrack() {
	window.pywebview.api.prev_track().then(trackIndex => {
		currentTrack = trackIndex;
		document.getElementById("track-info").value = "playing : " + getTrackName(currentTrack) ;
	});
}

function getTrackName(index) {
    if (playlist && playlist.length > 0 && index >= 0 && index < playlist.length) {
        const fullPath = playlist[index];
        if (fullPath) {
            const pathParts = fullPath.split(/[\/\\]/);
            return pathParts[pathParts.length - 1];
        }
    }
    return "No track selected";
}

function updateTrackInfo() {
    let trackInfo = document.getElementById("track-info");
    if (!trackInfo) return;
    
    if (playlist && playlist.length > 0 && currentTrack >= 0 && currentTrack < playlist.length) {
        const trackName = getTrackName(currentTrack);
        trackInfo.value = trackName;
    } else { 
        trackInfo.value = "no mp3 files found. Select a folder";
    }
}

function changeTheme(theme) {
    document.body.className = theme;
}

