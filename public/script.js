let currentsong=new Audio();
let song;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5501/assets/Song%20audio/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/").pop());
    }
  }
  return songs;
}

const playMusic = (track,pause=false) => {
    currentsong.src="/assets/Song audio/" + track;
    if(!pause){
        currentsong.play();
    play.src="/assets/pause.svg";

    }
    
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"

}


async function main() {
    
     song = await getSongs();
    playMusic(song[0],true);
    let songUl = document
        .querySelector(".songList")
        .getElementsByTagName("ul")[0];
        
    for (const s of song) {
        let p=decodeURI(s);
        songUl.innerHTML =
            songUl.innerHTML +
            `<li><img class="filter" width="34" src="/assets/music.svg" alt="">
                <div class="info">
                    <div class="hide">${s}</div>
                    <div>${p}</div>
                    <div>Anirudh</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="filter" src="/assets/play.svg" alt="" id="tplay">
                </div> </li>`;
                p=p+1;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(songName);
            
        })
    });
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src="/assets/pause.svg";
            
        }
        else{
            currentsong.pause();
            play.src="/assets/play.svg";
        }
    })

    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";
    })
        document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    document.querySelector(".hamburgerimg").addEventListener("click", () => {
        const leftSidebar = document.querySelector(".left");
        leftSidebar.classList.toggle("show");
    });
    previous.addEventListener("click",()=>{
        currentsong.pause();
       let index=song.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if((index-1)>=0){
            playMusic(song[index-1]);
        }
    })
    next.addEventListener("click",()=>{
        currentsong.pause();
        let index=song.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if((index+1)<song.length){
            playMusic(song[index+1]);
        }
        
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume=parseInt(e.target.value)/100;
    })
    
}
main();
