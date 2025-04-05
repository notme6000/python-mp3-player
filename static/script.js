const button = document.getElementById("toggleplaypause");
const img = document.getElementById("playpausebutton");

const playimage = "play.png";
const pauseimage = "pause.png";

button.addEventListener("click", () => {
	img.src = img.src.includes(playimage) ? pauseimage : playimage;
});

let playlist = [];
let currentTrack = 0;

window.pywebview.ready().then(() => {
	window.pywebview.api.get_playlist().then(response => {
		playlist = JSON.parse(response);
		if (playlist.length > 0) {
			currentTrack = 0	
			document.getElementById("track-info").value = getTrackName(currentTrack);			
			updateTrackInfo();
		} else {
			document.getElementById("track-info").value = "no mp3 files found.select a folder.";
		}
	});
});
function openFolder() {
	window.pywebview.api.open_folder().then(response => {
		playlist = JSON.parse(response);
		if (playlist.length > 0) {
			document.getElementById("track-info").value = "Loaded " + playlist.length + " songs.";
			currentTrack = 0;
			updateTrackInfo();
		} else {
			document.getElementById("track-info").value = "no mp3 files found.";
		}
	});
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
	if (playlist.length > 0 && playlist[index]) {
		return playlist[index].split('/').pop();
	}
	return "damn no track playing";
}

function updateTrackInfo() {
	let trackInfo = document.getElementById("track-info");

	if (playlist.length > 0 && playlist[currentTrack]) {
		const trackName = playlist[currentTrack].split('/').pop();
		trackInfo.value = trackName;
	} else { 
		trackInfo.value = "no mp3 file found. Select a folder";
	}
}
