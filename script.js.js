console.log("let's write some javascript");
let currentSong= new Audio();
let songs;
let currFolder;
function formatTime(seconds) {
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Floor to handle fractions

    // Ensure seconds are formatted as two digits
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted time
    return `${minutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
    currFolder=folder;
    let a = await fetch(`/${folder}/`); // Ensure the file exists
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1]));
        }
    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML=" ";
    for (const song of songs) {
        songUL.innerHTML += `<li>  
            <img class="invertor" src="spotify_assests/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ").replace("(PagalWorld.com.sb)", " ").replace("_320", " ")}</div>
                <div>Animesh</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invertor" src="spotify_assests/play.svg" alt="">
            </div>
        </li>`;
    }

    // Add click event to play songs
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", element => {
            playMusic(songs[index]);
        });
    });
    return songs
}

const playMusic = (track,pause=false) => {
    // let audio = new Audio("/songs/" + track);
    currentSong.src=`/${currFolder}/` + track
    if(!pause){
        currentSong.play()
         play.src="spotify_assests/pause.svg"
    }
    
   
    document.querySelector(".songinfo").innerHTML= track.replaceAll("%20", " ").replace("(PagalWorld.com.sb)", " ").replace("_320", " ").replace(".mp3"," ");
    document.querySelector(".songtime").innerHTML="00:00/00:00"
    
}

async function displayAlbums() {
    let a = await fetch(`/songs/`); // Ensure the file exists
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let card_container = document.querySelector(".card_container");
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];

            // Fetch metadata for each folder
            let metadataResponse = await fetch(`/songs/${folder}/info.json`);

            // Ensure the response is not empty and is valid JSON
            let metadataText = await metadataResponse.text();
            if (metadataText.trim().length > 0) { // Check if the response is not empty
                // Basic JSON validation by checking if it starts with '{' and ends with '}'
                if (metadataText.startsWith('{') && metadataText.endsWith('}')) {
                    let metadata = JSON.parse(metadataText);
                    card_container.innerHTML += `<div data-folder="${folder}" class="card border">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46" width="46" height="46" fill="black">
                                <circle cx="23" cy="23" r="23" fill="#4fff33" />
                                <g transform="translate(11.5, 11.5) scale(1)">
                                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" fill="black"/>
                                </g>
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <p>${metadata.title}</p>
                    </div>`;
                }
            }
        }
    }

    // Load the playlist whenever a card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            // playMusic(songs[0], true); // Uncomment this line if you want to play the first song from the new playlist
        });
    });
}

async function main() {

   
    // Get the list of all the songs
      await getSongs("songs/ncs");
    playMusic(songs[0],true)

    //Display all the albums on the page 
    displayAlbums() 

    //Attach an event listener to play, next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="spotify_assests/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="spotify_assests/play.svg"
        }
    });

    //Listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
       document.querySelector(".songtime").innerHTML= `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
       document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    //Add an Event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left= percent + "%";
        currentSong.currentTime=((currentSong.duration)* percent)/100
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left= "0"
        // document.querySelector(".container").style.height="120vh"
        // document.querySelector(".right").style.height="116vh"
        
    })

    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left= "-120%"
       
    })
    
   // Add event listener to previous button
previous.addEventListener("click", () => {
    currentSong.pause();
    let currentTrack = currentSong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(decodeURIComponent(currentTrack));

    if (index > 0) {
        playMusic(songs[index - 1]);
    } else {
        // Handle case when it's the first song and wrap around
        playMusic(songs[songs.length - 1]);
    }
});

// Add event listener to next button
next.addEventListener("click", () => {
    currentSong.pause();
    let currentTrack = currentSong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(decodeURIComponent(currentTrack));

    if (index < songs.length - 1) {
        playMusic(songs[index + 1]);
    } else {
        // Handle case when it's the last song and wrap around
        playMusic(songs[0]);
    }
});

 // Add an event to volume
 document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("click",(e)=>{
    currentSong.volume= parseInt(e.target.value)/100
 })

 //Add event listener to volume button
 document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("spotify_assests/volume.svg") ){
        e.target.src= e.target.src.replace("spotify_assests/volume.svg","spotify_assests/mute.svg")
        currentSong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src= e.target.src.replace("spotify_assests/mute.svg","spotify_assests/volume.svg")
        currentSong.volume=.10;
        document.querySelector(".range").getElementsByTagName("input")[0].value=40;
    }
 })

}

main();
