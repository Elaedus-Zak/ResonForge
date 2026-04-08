
import { Heart, ListPlus } from "lucide-react";
import placerholder from "../assets/album-placeholder.webp";
import "./SongCard.css"
import { useState } from "react";
import api from "../services/api";
import DeleteHandler from "./DeleteHandler";
function SongCard({song , SelfSelect,currentSong,home,isbgset,isliked,showPlus,handleAddSongtoPlaylists,showTrash,playlistId,getPlaylistSongs}){
    const token = localStorage.getItem("token")
    const [isLiked,setIsLiked]= useState(isliked);
    const showAddtoPlaylist = showPlus || false
    const showDeleteSong = showTrash || false
    const Isbgset= isbgset||false
    const IsHome =home || false
    function Click(){
        console.log(song);
        SelfSelect(song);
        
    }
    let isSelected;
    if(currentSong){
        isSelected =
    currentSong.id===song.id?true:false;
    }
    async function handleLike(e){
        e.stopPropagation()
        if(!isLiked){
            setIsLiked(true)
        const addtolib = await api.post("/api/library/add",{songData:song},{
    headers:{
      "Authorization":`Bearer ${token}`
    }},)
    console.log(addtolib.data)
        }else{
            setIsLiked(false)
            const removefromlib = await api.post("/api/library/remove",{songId:song.id},{
    headers:{
      "Authorization":`Bearer ${token}`
    }},)
    console.log(removefromlib.data)
        }
    
}
    return(
        
        
        <div className={Isbgset?"songcard bg":(IsHome?"songcard home":"songcard")} onClick={Click}>
            <div className="metadata">
                <img src={song.thumbnail===undefined?placerholder:song.thumbnail} className="cardcover" style={{borderRadius : 10}}></img>
            <div className="cardinfo">
                <span className="cardname" style={{display : "block",fontSize:"large",color:`${isSelected?"#0a51d4ff":"var(--text-soft)"}`}}>{song.name.replace("&#39;","'")}</span>
                <span className="cardartist" style={{display : "block",fontSize:"small",color:`var(--text-muted)`}}>by {song.artist}</span>
                <div className="songcontrols">
                    <button className="like" onClick={handleLike}><Heart size={20} 
                fill={isLiked ? "#0a51d4ff" : "none"} 
                color={isLiked ? "#0a51d4ff" : "white"}
                /></button>
                {showAddtoPlaylist&&
                <button className="addsongtoplaylist" onClick={(e)=>{e.stopPropagation();handleAddSongtoPlaylists(song)}}><ListPlus  size={20}
                color="white"
                /></button>
                }
                {showDeleteSong &&
                <DeleteHandler  playlistId={playlistId} ofplaylist={false} songId={song.id} getPlaylistSongs={getPlaylistSongs}  />
                }
                
                </div>
                
            </div>
            <span className="isplayingindc" style={{color:"#0a51d4ff",padding:"0",height:"25px"}}>{isSelected?"Now is Playing":""}</span>
                
            </div>
            
        </div>
    )
}
export default SongCard;