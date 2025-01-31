const token = 'BQBZiiCqVjpZz9Boj1-8WirXFLgBpfZJwSR0Kw';
const player = new Spotify.Player({
    name: 'Gradient Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5
});

player.connect().then(success => {
    if (success) console.log('Connected to Spotify!');
});

const artwork = document.getElementById('album-art');
const playPauseBtn = document.getElementById('play-pause');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const volumeSlider = document.getElementById('volume');
const queueList = document.getElementById('queue');

artwork.addEventListener('click', () => {
    player.togglePlay();
});

document.getElementById('play-pause').addEventListener('click', () => player.togglePlay());
document.getElementById('next').addEventListener('click', () => player.nextTrack());
document.getElementById('prev').addEventListener('click', () => player.previousTrack());
volumeSlider.addEventListener('input', (e) => player.setVolume(e.target.value / 100));

async function fetchQueue() {
    const response = await fetch('https://api.spotify.com/v1/me/player/queue', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    queueList.innerHTML = data.queue.map(track => `<li>${track.name} - ${track.artists[0].name}</li>`).join('');
}

queueList.addEventListener('mouseover', () => queueList.style.opacity = '1');
queueList.addEventListener('mouseout', () => queueList.style.opacity = '0.7');

player.addListener('player_state_changed', state => {
    if (!state) return;
    artwork.src = state.track_window.current_track.album.images[0].url;
});

fetchQueue();
