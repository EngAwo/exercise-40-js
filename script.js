
// CREATE VIDEO PLAYER

const video = document.getElementById('video');

// SELECT DOM ELEMENTS

const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const title = document.getElementById('title');
const description = document.getElementById('description');

const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');

const volumeSlider = document.getElementById('volume');
const speedSelect = document.getElementById('speed');

const muteBtn = document.getElementById('mute');
const fullscreenBtn = document.getElementById('fullscreen');

const playlistContainer = document.getElementById('playlist');
const status = document.getElementById('status');

// VIDEO DATA

const videos = [

  {
        title: 'wacdi -diini ah',
        description: 'Another sample video for testing.',
        src: 'Ma_Rabtaa_Inuu_Allah_Kuu_Hiiliyo __ Sheikh_Mustafa_Xaji_Haaruun.mp4'
    },

    {
        title: 'tech-video',
        description: 'EDITING STUDY VIDEO.',
        src: 'Tech Video.mp4'
    },

    {
        title: 'youtube advertise',
        description: 'An entertainment video sample.',
        src: 'Gradient Style End Screen Youtube Outro Video.mp4'
    },

    {
        title: 'motifational video',
        description: 'A video sample for your playlist.',
        src: 'If You Want to be Wealthy & Happy.mp4'
    }

];

// PLAYER VARIABLES

let videoIndex = 0;
let speed = 1;
let lastVolume = 1;

// FORMAT VIDEO TIME

function formatTime(time) {

    if (!Number.isFinite(time)) {
        return '0:00';
    }

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, '0');

    return `${minutes}:${seconds}`;

}

// UPDATE PLAY BUTTON

function updatePlayButton() {

    const icon = playBtn.querySelector('i');

    if (video.paused) {

        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');

        playBtn.setAttribute('aria-label', 'Play');

    } else {

        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');

        playBtn.setAttribute('aria-label', 'Pause');

    }

}

// LOAD VIDEO

function loadVideo(index, autoplay = false) {

    videoIndex = index;

    const selectedVideo = videos[videoIndex];

    // Update video information
    title.textContent = selectedVideo.title;
    description.textContent = selectedVideo.description;

    // Stop previous video
    video.pause();

    // Load new video URL
    video.src = selectedVideo.src;

    video.playbackRate = speed;

    video.load();

    // Reset progress information
    progress.style.width = '0%';

    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';

    // Update playlist
    updatePlaylist();

    updatePlayButton();

    status.textContent = 'Loading video...';

    if (autoplay) {
        playVideo();
    }

}

// PLAY VIDEO

async function playVideo() {

    try {

        await video.play();

        updatePlayButton();

        status.textContent = '';

    } catch (error) {

        console.error('Error playing video:', error);

        updatePlayButton();

        status.textContent =
            'Unable to play this video. Check the video URL or connection.';

    }

}

// PAUSE VIDEO

function pauseVideo() {

    video.pause();

    updatePlayButton();

}

// TOGGLE PLAY / PAUSE

function togglePlay() {

    if (video.paused) {

        playVideo();

    } else {

        pauseVideo();

    }

}

// PREVIOUS VIDEO

function prevVideo() {

    videoIndex--;

    if (videoIndex < 0) {

        videoIndex = videos.length - 1;
    }

    loadVideo(videoIndex, true);
}

// NEXT VIDEO

function nextVideo() {

    videoIndex++;

    if (videoIndex >= videos.length) {

        videoIndex = 0;
    }

    loadVideo(videoIndex, true);
}

// UPDATE PROGRESS BAR

function updateProgress() {

    const duration = video.duration;
    const currentTime = video.currentTime;

    if (!Number.isFinite(duration) || duration <= 0) {
        return;
    }

    // Calculate progress percentage
    const progressPercent = (currentTime / duration) * 100;

    progress.style.width = `${progressPercent}%`;

    // Update current time
    currentTimeEl.textContent = formatTime(currentTime);

    // Update total duration
    durationEl.textContent = formatTime(duration);

}

// SEEK VIDEO

function setProgress(e) {

    const duration = video.duration;

    if (!Number.isFinite(duration) || duration <= 0) {
        return;
    }

    // Get progress bar position
    const rect = progressContainer.getBoundingClientRect();

    const clickX = e.clientX - rect.left;

    const width = rect.width;

    // Calculate new video time
    const percentage = Math.max(0, Math.min(1, clickX / width));

    video.currentTime = percentage * duration;
}

// CHANGE VOLUME

function changeVolume(e) {

    video.volume = Number(e.target.value);

    if (video.volume > 0) {

        lastVolume = video.volume;

    }

    video.muted = video.volume === 0;

    updateMuteButton();
}

// MUTE / UNMUTE VIDEO

function toggleMute() {

    if (video.muted || video.volume === 0) {

        video.muted = false;

        video.volume = lastVolume || 1;

        volumeSlider.value = video.volume;

    } else {

        lastVolume = video.volume;

        video.muted = true;
    }

    updateMuteButton();
}

// Update mute icon
function updateMuteButton() {

    const icon = muteBtn.querySelector('i');

    if (video.muted || video.volume === 0) {

        icon.className = 'fas fa-volume-mute';

        muteBtn.setAttribute('aria-label', 'Unmute');

    } else if (video.volume < 0.5) {

        icon.className = 'fas fa-volume-down';

        muteBtn.setAttribute('aria-label', 'Mute');

    } else {

        icon.className = 'fas fa-volume-up';

        muteBtn.setAttribute('aria-label', 'Mute');

    }

}

// CHANGE PLAYBACK SPEED

function changeSpeed(e) {

    speed = parseFloat(e.target.value);

    video.playbackRate = speed;
}

// FULLSCREEN

async function toggleFullscreen() {

    const videoScreen = document.querySelector('.video-screen');

    try {

        if (!document.fullscreenElement) {

            await videoScreen.requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    } catch (error) {

        console.error('Fullscreen error:', error);

        status.textContent = 'Fullscreen is not available.';
    }
}

// Update fullscreen icon
document.addEventListener('fullscreenchange', () => {

    const icon = fullscreenBtn.querySelector('i');

    if (document.fullscreenElement) {

        icon.className = 'fas fa-compress';

    } else {

        icon.className = 'fas fa-expand';
    }
});

// CREATE VIDEO PLAYLIST

function createPlaylist() {

    playlistContainer.innerHTML = '';

    videos.forEach((videoItem, index) => {

        const playlistItem = document.createElement('button');

        playlistItem.type = 'button';

        playlistItem.className = 'playlist-item';

        playlistItem.innerHTML = `
            <i class="fas fa-play-circle"></i>

            <div class="video-details">

                <h4>${videoItem.title}</h4>

                <p>${videoItem.description}</p>

            </div>
        `;

        // Select video from playlist
        playlistItem.addEventListener('click', () => {

            loadVideo(index, true);

        });

        playlistContainer.appendChild(playlistItem);

    });

    updatePlaylist();
}

//  UPDATE ACTIVE PLAYLIST ITEM

function updatePlaylist() {

    const playlistItems =
        playlistContainer.querySelectorAll('.playlist-item');

    playlistItems.forEach((item, index) => {

        const icon = item.querySelector('i');

        if (index === videoIndex) {

            item.classList.add('active');

            icon.className = video.paused
                ? 'fas fa-play-circle'
                : 'fas fa-pause-circle';

            item.setAttribute('aria-current', 'true');

        } else {

            item.classList.remove('active');

            icon.className = 'fas fa-play-circle';

            item.removeAttribute('aria-current');
        }
    });
}

// VIDEO EVENT LISTENERS

// Play button
playBtn.addEventListener('click', togglePlay);

// Previous and next buttons
prevBtn.addEventListener('click', prevVideo);
nextBtn.addEventListener('click', nextVideo);

// Update progress while playing
video.addEventListener('timeupdate', updateProgress);

// Click progress bar to seek
progressContainer.addEventListener('click', setProgress);

// When video ends, play next video
video.addEventListener('ended', nextVideo);

// Volume control
volumeSlider.addEventListener('input', changeVolume);

// Mute button
muteBtn.addEventListener('click', toggleMute);

// Playback speed
speedSelect.addEventListener('change', changeSpeed);

// Fullscreen button
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Update player when video starts or pauses
video.addEventListener('play', () => {

    updatePlayButton();
    updatePlaylist();

});

video.addEventListener('pause', () => {

    updatePlayButton();
    updatePlaylist();

});

// Video metadata loaded
video.addEventListener('loadedmetadata', () => {

    durationEl.textContent = formatTime(video.duration);

    updateProgress();

    status.textContent = '';
});

// Video is ready
video.addEventListener('canplay', () => {

    status.textContent = '';

});

// Video loading error
video.addEventListener('error', () => {

    updatePlayButton();

    status.textContent =
        'Video could not be loaded. Check the URL or video format.';
});

// Waiting for video data
video.addEventListener('waiting', () => {

    status.textContent = 'Buffering video...';
});

// INITIALIZE PLAYER

createPlaylist();

loadVideo(videoIndex);
