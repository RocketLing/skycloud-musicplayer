
const musicPlayer = document.querySelector(".wrapper");

const trackImg = document.querySelector(".img img");
const trackTitle = document.querySelector(".song-title");
const trackArtist = document.querySelector(".artist");

const mainAudio = document.querySelector("#main-audio");
const playPause = document.querySelector(".play-pause");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

const progressBar = document.querySelector(".prog-bar");
const progressArea = document.querySelector(".control-prog");
const volumeBar = document.querySelector(".volume-slider");

const playList = document.querySelector(".playlist");
const showPlayList = document.querySelector("#more-music");
const hidePlayList = document.querySelector("#close");


//GLOBAL
let musicIndex = Math.floor(Math.random() * allTracks.length) + 1;

let isPlaying = false;




window.addEventListener("load", () => {
    loadTracks(musicIndex);
    nowPlaying();

    
});

// ------- FUNCTIONS -------

//LOAD MUSIC
function loadTracks(indexNum) {
    trackTitle.innerText = allTracks[indexNum - 1].title;
    trackArtist.innerText = allTracks[indexNum - 1].artist;
    trackImg.src = `image/${allTracks[indexNum - 1].img}.jpg`;
    mainAudio.src = `${allTracks[indexNum - 1].src}.mp3`;
};


//PLAY - PAUSE BTN
function playPauseMusic() {
    if (!isPlaying) playMusic();
    else pauseMusic();
}

function playMusic() {
    mainAudio.play();
    isPlaying = true;

    playPause.innerHTML = '<i class="bx bx-pause"></i>';
};

function pauseMusic() {
    mainAudio.pause();
    isPlaying = false;

    playPause.innerHTML = '<i class="bx bx-play"></i>';
};


// PREVIOUS - NEXT TRACK
function nextMusic() {
    if (musicIndex < allTracks.length -1) {
        musicIndex += 1;
    } else {
        musicIndex = 0;
    };

    loadTracks(musicIndex);
    playMusic();    
}

function prevMusic() {
    if (musicIndex > 0) {
        musicIndex -= 1;
    } else {
        musicIndex = allTracks.length - 1
    };

    loadTracks(musicIndex);
    playMusic(); 
}


// TRACK DURATION
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // current track time
    const duration = e.target.duration; // total duration

    let progressRange = (currentTime / duration) * 100;
    progressBar.style.width = `${progressRange} %`;

    let musicCurrentTime = document.querySelector(".current");
    let musicDuration = document.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {

        //total duration
        let trackDuration = mainAudio.duration;
        let totalMin = Math.floor(trackDuration / 60);
        let totalSec = Math.floor(trackDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    //current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
    let progressValue = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let trackDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressValue) * trackDuration;
    playMusic();
});


// SET VOLUME
function setVolume () {
    mainAudio.volume = volumeBar.value / 100;
}



// ----- PLAYLIST ---- 


//SHOW / HIDE
showPlayList.addEventListener("click", () => {
    playList.classList.toggle("show");
});

hidePlayList.addEventListener("click", () => {
    showPlayList.click();
});


// LIST
const ulElement = document.querySelector("ul");

//create li according to length of the playlist
for (let i = 0; i < allTracks.length; i++) {
    let liElement = `<li li-index="${i + 1}">
                        <div class="row">
                            <span>${allTracks[i].title}</span>
                            <p>${allTracks[i].artist}</p>
                        </div>
                        <audio id="${allTracks[i].src}" src="${allTracks[i].src}.mp3"></audio>
                        <span id="${allTracks[i].src}" class="duration"></span>
                    </li>`;
    ulElement.insertAdjacentHTML("beforeend", liElement);

}

const allLiElements = ulElement.querySelectorAll("li");
function nowPlaying() {



    for (let k = 0; k < allLiElements.length; k++) {
        let audioTag = allLiElements[k].querySelector(".duration");

        if(allLiElements[k].classList.contains("now-playing")) {
            allLiElements[k].classList.remove("now-playing");

            let addDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = addDuration;
        }

        if(allLiElements[k].getAttribute("li-index") == musicIndex) {
            allLiElements[k].classList.add("now-playing");
            audioTag.innerText = "Playing";
        }

        allLiElements[k].setAttribute("onclick", "clicked(this)");
    };
};



 function clicked(element) {
    let getIndex = element.getAttribute("li-index");
    musicIndex = getIndex;

    loadTracks(musicIndex);
    playMusic();
    nowPlaying();
 }