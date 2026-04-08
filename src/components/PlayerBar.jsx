import emptycover from "../assets/album-placeholder.webp";
import volumeicon from "../assets/volume.png";
import playicon from "../assets/play.png";
import pauseicon from "../assets/pause.png"
import nexticon from "../assets/next.png";
import previousicon from "../assets/previous.png"

import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import Spinner from "./Spinner";

function PlayerBar({selSong,handleNext,handlePrev}){
    
    
    const [IsPlaying , setIsPlaying] =useState(false);
    const [volume ,setVolume] =useState(1);
    const audioRef = useRef(null);
    const [isLinkLoading,setisLinkLoading] =useState(true);
    function handlePlay(){
        setIsPlaying(true);
        audioRef.current.play();
        
    }
    function handlePause(){
        setIsPlaying(false);
        audioRef.current.pause();
        
    }
    function handlePop(){
        if(IsPlaying){
            handlePause();
        }else{
            handlePlay();
        }
        
    }
    useEffect(()=>{
        document.title = selSong ? `${selSong.name} - ResonForge`:"ResonForge"
        if ('mediaSession' in navigator && selSong) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: selSong.name,
                artist: selSong.artist || "Unknown Artist",
                
                artwork: [
                    { src: selSong.thumbnail || null, sizes: '512x512', type: 'image/png' }
                ]
                });

    // Optional: Add action handlers for the OS buttons
                navigator.mediaSession.setActionHandler('play', () => {
                handlePlay();
                });
                navigator.mediaSession.setActionHandler('pause', () => {
                handlePause();
                });
                navigator.mediaSession.setActionHandler('previoustrack', () => {
                    handlePrev(); // Your function to skip back
                });
                navigator.mediaSession.setActionHandler('nexttrack', () => {
                    handleNext(); // Your function to skip forward
                });
            }
    },[selSong,handleNext,handlePrev])
    
    useEffect(()=>{
        if (!selSong){return};
        //audioRef.current.load();
        audioRef.current.play()
        .then(() => setIsPlaying(true))    // only if success
        //.catch(() => setIsPlaying(false)); // reset if blocked

    },[selSong])
    const [duration,setDuration] = useState(0);
    const [currentTime,setCurrentTime] = useState(0);
    useEffect(()=>{
        setDuration(0)
        
        const audioE = audioRef.current;
        if(!audioE) return;
        function BarUpdate(){setCurrentTime(audioE.currentTime)};
        function DurSet(){setDuration(audioE.duration)};
        audioE.addEventListener("timeupdate",BarUpdate);
        audioE.addEventListener("loadedmetadata",DurSet);
        return () => {
        audioE.removeEventListener("timeupdate", BarUpdate);
        audioE.removeEventListener("loadedmetadata", DurSet);
    };
    },[selSong])
    
    function handlePoint(e){
        audioRef.current.currentTime = e.target.value;
        setCurrentTime(e.target.value);
    }
    function handleVolumeChange(e){
        if (!audioRef.current) return;
        let mvalue = parseFloat(e.target.value);
        setVolume(mvalue);
        audioRef.current.volume = mvalue;
    }
    function format(time){
        let m = Math.floor(time / 60);
        let s = Math.floor(time % 60);
        return (`${m}:${s<10?"0":""}${s}`)
    };
    const percent= (currentTime/duration) *100||0
    const Vpercent = (volume/1)*100||0
    if (!selSong) {
        return (
            <div className="playerbar" style={{justifyContent:"flex-start" , paddingLeft:"14px"}}>
                <div className="songinfo">
                    <img src={emptycover} id="albumcover" style={{ borderRadius: 10 }} />
                    <div className="songmeta">
                        <span id="songtext">No song selected</span>
                        <span id="artistname">-</span>
                    </div>
                </div>
            </div>
        );
    }
    
    return(
        <div className="playerbar">
            <div className="songinfo">
                <img src={selSong.thumbnail===undefined?emptycover:selSong.thumbnail} id="albumcover" style={{borderRadius : 10}}></img>
                <div className="songmeta">
                    <marquee id="songname" width="180px" style={{display : "block"}} direction={"right"}>{selSong.name}</marquee>
                    <span id="artistname" style={{display : "block",height:"40px",width:"150px"}}>by {selSong.artist}</span>
                </div>
            </div>
            <div className="playback">
                <audio ref={audioRef} src={`${api.defaults.baseURL}${selSong.audiosrc}`} onCanPlay={()=>{setisLinkLoading(false)} } onWaiting={()=>{setisLinkLoading(true)}} onEnded={handleNext} ></audio>
                <div className="fullcontrol">
                    <div className="control">
                    <button className="playbackbtn" id="previous" onClick={handlePrev} style={{backgroundImage:`url(${previousicon})`}}></button>
                    {isLinkLoading?<div className="spinner"><Spinner color={"white"} size={15}/></div>:
                    <button className="playbackbtn" id="pop" onClick={handlePop} style={{backgroundImage : `url(${IsPlaying ? pauseicon:playicon})`}}></button>}
                    <button className="playbackbtn" id="next" onClick={handleNext} style={{backgroundImage :`url(${nexticon})`}}></button>
                </div>
                
                <div className="progress">
                    <span id="currenttime">{format(currentTime)}</span>
                    <input type="range" id="progressbar" min={"0"} value={currentTime} max={duration} onChange={handlePoint} style={{
            background: `linear-gradient(to right, #053da5 ${percent}%, #444 ${percent}%)`
        }}></input>
                    <span id="duration">{format(duration)}</span>
                </div>
                </div>
            </div>
            <div className="volume">
                <img src={volumeicon} id="volumeicon"></img>
                <input type="range" id="volumelevel" min={"0"} max={"1"} value={volume} step={"0.01"} onChange={handleVolumeChange} style={{
            background: `linear-gradient(to right, #053da5 ${Vpercent}%, #444 ${Vpercent}%)`
        }}></input>
            </div>
        </div>
        
    )
}
export default PlayerBar;