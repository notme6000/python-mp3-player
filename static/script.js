const button = document.getElementById("toggleplaypause");
const img = document.getElementById("playpausebutton");

const playimage = "play.png";
const pauseimage = "pause.png";

button.addEventListener("click", () => {
	img.src = img.src.includes(playimage) ? pauseimage : playimage;
});

let playlist = [];
let currentTrack = 0;

window.pywebview.api.get_playlist().then(response => {
	playlist = JSON.parse(response);
	if (playlist.length > 0) {
		document.getElementById("track-info").value = "Loaded" + playlist.length + "songs.";
	} else {
		document.getElementById("track-info").value = "no mp3 files found.select a folder.";
	}
});

function openFolder() {
	window.pywebview.api.open_folder().then(response => {
		playlist = JSON.parse(response);
		if (playlist.length > 0) {
			document.getElementById("track-info").value = "Loaded" + playlist.length + "songs.";
		} else {
			document.getElementById("track-info").value = "no mp3 files found.";
		}
	});
}

function playPause() {
	window.pywebview.api.play_pause().then(isPlaying => {
		document.getElementById("track-info").value = isPlaying ? "playing...": "paused";
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
	return playlist.length > 0 ? playlist[index].split('/').pop() : "no track playing";
}

function updateTrackInfo() {
	let trackInfo = document.getElementById("track-info");

	if (playlist.length > 0) {
		let currentTrack = playlist[currentTrackIndex];
		let trackName = currentTrack.split('/').pop();
		trackInfo.value = trackName;
	} else { 
		trackInfo.value = "no mp3 file found. Select a folder";
	}
}
