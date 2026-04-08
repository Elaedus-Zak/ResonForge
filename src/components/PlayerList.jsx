import { ChevronLeft, Plus } from 'lucide-react';
import PlaylistCard from "./PlaylistCard";
import SongCard from "./SongCard";

import Spinner from './Spinner';
import { useEffect, useState } from 'react';
import Modal from './Modal';
import api from '../services/api';
;

//import songs from "./Songs.js";
function PlayerList({SelectedSong,setModalState,setActivePage,IsDiscover,userInfoState,IsSearchinit,discoverSongs,recentSongs,IsRecentSongs,getPlaylists,handleAddSongtoPlaylists,IsPlaylistSongs ,playlistSongs,setPlaylistSongs,getPlaylistSongs,handleAddtoPlaylistForm,likedIds,songs,IsSearch,SearchSongs,activePage,inPlaylist,setinPlaylist,playlists,currentSong,IsPlaylistsLoaded,IsSongsLoaded}){
    const [background,setBackground] = useState(null);
    const [AIplaylistState,setAIplaylistState] = useState({loading:true,playlistObj:null,message:"Not Intitalizedp"});
    const [Prompt,setPrompt] =useState("");
    const [AiLoading,setAiLoading] = useState(false)
    
    
    useEffect(()=>{
        if(currentSong&&songs.includes(currentSong)){
            setBackground(currentSong.thumbnail)
        }else{
            setBackground(null)
        }
    },[currentSong])
    
    if(activePage==="library"){
        if (IsSongsLoaded){
            
            return(
                
        <div className={background?"playerlist bg":"playerlist"}  style={{"--bg-img":background?`url("${background}")`:""}} >
            <div 
                    key={background} // This MUST be on this specific div
                    className="forge-bg"
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: background ? `url("${background}")` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "blur(8px) brightness(0.5)",
                        zIndex: 0,
                        animation: "fadeIn 0.8s ease-in-out forwards"
                    }} 
                />
            <div className='contentholder'>
            {songs.length===0?<span style={{alignSelf:"center",justifySelf:"center",color:"white",gridRow:"1/3",gridColumn:"2/4"}}>No Song yet.</span>:songs.map(song =>
                {
                    const IsLiked = likedIds.includes(song.id);
                    return(
                        <SongCard key={song.id} song={song} isbgset={background?true:false}  SelfSelect={SelectedSong} isliked={IsLiked} currentSong={currentSong}/>
                    )
                }
            )}
            </div>
        </div>
            )   
        }else{
            return(
                <div className='playerlist inplaylist' style={{justifyContent:"center"}}>
                    <Spinner/>
                </div>
          )
        }  
    }
    function Back(){
        setinPlaylist(null);
        setPlaylistSongs([]);
        getPlaylists();
    }
    if(activePage==="playlist"){
        if (!inPlaylist){
            
            if (IsPlaylistsLoaded){
                return(
            <div className="playerlist">
                <div className='contentholder'>
                {playlists.length > 0?playlists.map(playlist => 
                    <PlaylistCard key={playlist.id} playlist={playlist} setinPlaylist={setinPlaylist} getPlaylistSongs={getPlaylistSongs} getPlaylists={getPlaylists}/>)
                    :<span style={{alignSelf:"center",justifySelf:"center",color:"white",gridRow:"1/3",gridColumn:"2/4"}}>No Playlists yet.</span>
                }
                </div>
            </div>
             )
            }else{
                return(
                    <div className='playerlist inplaylist' style={{justifyContent:"center"}}>
                    <Spinner/>
                </div>
                )
            }
        }else{
            console.log(inPlaylist);
           /* if (IsSongsLoaded){
                setItSongs(songs.filter(song=> inPlaylist.songIds.includes(song.id)))
            }*/
            
                return(
            <div className="playerlist inplaylist">
                <article className="listheader">
                    <button onClick={Back} className='playbackbtn back'><ChevronLeft size={40} strokeWidth={2} /></button>
                    <div className='headerlistinfo' >
                        <span className='playlisttitle' style={{fontSize :"x-large",textDecoration:"",display:"block"}}><b>{inPlaylist.name}</b></span>
                        <span className='songsnumber' style={{fontSize :"medium",display:"block"}}>{inPlaylist.songIds.length} Songs</span>
                    </div>
                    <button className='addplaylist' onClick={handleAddtoPlaylistForm} ><Plus size={35} strokeWidth={1.5} color='white' style={{marginRight:"15px"}}/></button>
                </article>
                <div className='listcontent'>
                        {!IsPlaylistSongs?(
                            <Spinner/>
                        ):(
    playlistSongs && playlistSongs.length > 0 ? (
        playlistSongs.map((song) => {
            const IsLiked = likedIds.includes(song.id);
            return (
                <SongCard 
                    key={song.id} 
                    song={song} 
                    SelfSelect={SelectedSong} 
                    isliked={IsLiked} 
                    currentSong={currentSong}
                    playlistId={inPlaylist.id}
                    showTrash={true}
                    getPlaylistSongs={getPlaylistSongs}
                    isbgset={false}
                />
            );
        })
    ) : (
        <p style={{alignSelf:"center",color:"white"}}>No Songs are present in this playlist</p>
    )
)}
                    
                    
                </div>
            </div>
                )
            
        
    
    
        }
    }
    async function GeneratePlaylist(){
        try{
            setAiLoading(true)
            const res = await api.get(`/api/aiplaylist?prompt=${Prompt}`)
            if (res.data.success){
                setAIplaylistState({loading:false,playlistObj:res.data.playlistObj,message:"Success"})
            }else{
                setAIplaylistState({loading:false,playlistObj:res.data.playlistObj,message:res.data.message})
            }
        }catch(err){
            console.error("generatingplaylist error", err)
        }finally{
            setActivePage("forge");
            setAiLoading(false)
        }
    }
    async function AddAiPlaylist() {
        try{
            const res = await api.post("/api/playlists/add",{PlaylistObj:AIplaylistState.playlistobj})
            console.log(res.data)
        }catch(err){
            console.log("Add error",err)
        }finally{
            document.querySelector("addplaylist").style.opacity="0.75";
            document.querySelector("addplaylist").style.pointerEvents= "none";
        }
    }
    if(activePage==="home"){
        return(
            <div className="playerlist home">
                <p style={{color:"var(--text-primary)",fontSize:"xx-large"}} ><b style={{fontFamily:"Expand"}}>Welcome to your <span style={{
                                                        background: "linear-gradient(90deg,rgba(40, 63, 240, 1) 35%, rgba(136, 56, 168, 1) 74%)",
                                                        WebkitBackgroundClip: "text", 
                                                        WebkitTextFillColor: "transparent", 
                                                        backgroundClip: "text", 
                                                        fontWeight: "bold" 
                                                    }}>forge</span> !</b></p>
                <div className="forgeplaylist"> 
                    <input type='text' className={AiLoading?"disabled":""} placeholder='Any ideas or toughts ..' value={Prompt} onChange={(e)=> setPrompt(e.target.value)}></input>
                    <button className={AiLoading?"getstarted gen disabled":"getstarted gen"} onClick={()=>{GeneratePlaylist();}}>Forge Playlist</button>
                    {AiLoading?(<Spinner/>):(<></>)}
                </div>
                <div style={{color:"white",fontSize:"x-large",height:"340px",display:"flex",flexDirection:"column",justifyContent:"center" }}><span style={{color:"var(--text-soft)"}}>Recently Added:</span><br/>
                <div className='contentholder home'>
                    {IsRecentSongs?(
                        recentSongs.length===0?<span style={{alignSelf:"center",justifySelf:"center",color:"white",gridRow:"1/3",gridColumn:"2/4"}}>No Song yet.</span>:recentSongs.map(song =>
                {
                    const IsLiked = likedIds.includes(song.id);
                    return(
                        <SongCard key={song.id} song={song} isbgset={false} home={true}  SelfSelect={SelectedSong} isliked={IsLiked} currentSong={currentSong}/>
                    )
                }
            )
                    ):(<Spinner/>)}
                </div>
                </div>
                <div style={{color:"white",fontSize:"x-large",height:"2380px"}}>Discover : <br/>
                <div className='contentholder home'>
                 {IsDiscover?(
                        discoverSongs.length===0?<span style={{alignSelf:"center",justifySelf:"center",color:"white",gridRow:"1/3",gridColumn:"2/4"}}>Something went wrong</span>:discoverSongs.map(song =>
                {
                    const IsLiked = likedIds.includes(song.id);
                    return(
                        <SongCard key={song.id} handleAddSongtoPlaylists={handleAddSongtoPlaylists} song={song} isbgset={false} home={true} showPlus={true} style={{height:"100%"}} SelfSelect={SelectedSong} isliked={IsLiked} currentSong={currentSong}/>
                    )
                }
            )
                ): (<><Spinner/>Looking for songs for you</>)}  
                </div>
                </div>
                
                
            </div>
        )
    }
    if(activePage==="search"){
        if (IsSearch){
            
            return(
                
        <div className="playerlist inplaylist" >
            
            <div className='listcontent' style={{margin:"0"}}>
                {SearchSongs.length===0?<span style={{alignSelf:"center",justifySelf:"center",color:"white",gridRow:"1/3",gridColumn:"2/4"}}>No Song yet.</span>:SearchSongs.map(song =>
                {
                    const IsLiked = likedIds.includes(song.id);
                    return(
                        <SongCard key={song.id} song={song} handleAddSongtoPlaylists={handleAddSongtoPlaylists} showPlus={true} SelfSelect={SelectedSong} isliked={IsLiked} currentSong={currentSong}/>
                    )
                }
            )}
            </div>
        </div>
            )   
        }else{
            return(
                <div className='playerlist inplaylist' style={{justifyContent:"center",alignItems:"center",color:"white"}}>
                    {IsSearchinit?<Spinner/>:<>Type something in search</>}
                </div>
            )
        }
    }
    if(activePage==="forge"){
        return(
            <div className="playerlist inplaylist">
                <article className="listheader">
                    <button onClick={()=>{setAIplaylistState({loading:false,playlistObj:null});setActivePage("home")}} className='playbackbtn back'><ChevronLeft size={40} strokeWidth={2} /></button>
                    <div className='headerlistinfo' >
                        <span className='playlisttitle' style={{fontSize :"x-large",textDecoration:"",display:"block"}}><b>{AIplaylistState.playlistObj.name}</b></span>
                        
                    </div>
                    <button className='addplaylist' onClick={AddAiPlaylist}  ><Plus size={35} strokeWidth={1.5} color='white' style={{marginRight:"15px"}}/></button>
                </article>
                <div className='listcontent'>
                        {AIplaylistState.loading?(
                            <Spinner/>
                        ):(
    AIplaylistState.playlistObj.songs && AIplaylistState.playlistObj.songs.length > 0 ? (
        AIplaylistState.playlistObj.songs.map((song) => {
            const IsLiked = likedIds.includes(song.id);
            return (
                <SongCard 
                    key={song.id} 
                    song={song} 
                    SelfSelect={SelectedSong} 
                    isliked={IsLiked} 
                    currentSong={currentSong}
                    
                    showTrash={false}
                    getPlaylistSongs={getPlaylistSongs}
                    isbgset={false}
                />
            );
        })
    ) : (
        <p style={{alignSelf:"center",color:"white"}}>No Songs are present in this playlist</p>
    )
)}
                    
                    
                </div>
            </div>
        )
    }
    if(activePage==="account"){
        if (!userInfoState.isloaded){
            return(
                <div className='playerlist inplaylist' style={{justifyContent:"center",color:"white"}}>
                    <Spinner/>
                </div>

            )
        }else{
        return(
                    <div className='playerlist' style={{justifyContent:"center",color:"white"}}>
                      
                    <div className='overview' style={{
                        color:"white",
                        padding:"20px",
                        display:"flex",
                        flexDirection:"column",
                        gap:"10px"
                        }}>
                        <div style={{fontSize:"xx-large"}}>Account Overview:</div>
                        Profile :<br/>
                        <div className='usertable' style={{
                            display:"flex",
                            flexDirection:"column",
                            border:"var(--border) 2px solid",
                            borderRadius:"15px",
                            gap:"2px",
                            overflow:"hidden",
                            boxShadow: "-3px 8px 30px rgba(0, 0, 0, 0.2)"
                        }}> 
                            <div className='inforow'><span>Username: {userInfoState.userInfo.username}</span>
                                <button className='getstarted' onClick={()=> setModalState({
                                PlaylistMode : false,
                                AccountMode:true,
                                setModalState:setModalState,
                                configMode:"usernameedit"
                            })}  style={{
                                padding:"4px 10px",
                                width:"115px"
                            }}>Edit Username</button>
                            </div>
                            <div className='inforow'><span>User ID : {userInfoState.userInfo.userId}</span></div>
                        </div>
                        <div style={{display:"flex",justifyContent:"right"}}>
                            <button className='getstarted' onClick={()=> setModalState({
                                PlaylistMode : false,
                                AccountMode:true,
                                setModalState:setModalState,
                                configMode:"changepswd"
                            })} style={{
                                marginRight:"10px",
                                width:"200px"
                            }}>Change Password</button>
                        </div>
                        Stats :<br/>
                        <div className='userbanktable' style={{
                            display:"flex",
                            flexDirection:"column",
                            border:"var(--border) 2px solid",
                            borderRadius:"15px",
                            gap:"2px",
                            overflow:"hidden",
                            boxShadow: "-3px 8px 30px rgba(0, 0, 0, 0.2)"
                        }}>
                            <div className='inforow'><span>Library Songs: {userInfoState.userInfo.library}</span>
                            <button className='getstarted' onClick={()=> setModalState({
                                PlaylistMode : false,
                                AccountMode:true,
                                setModalState:setModalState,
                                configMode:"delete",
                                deleteType:"library"
                            })} style={{
                                padding:"4px 10px",
                                backgroundColor:"red",
                                width:"115px"
                            }}>Clear Library</button>
                            </div>

                            
                            <div className='inforow'><span>Playlists: {userInfoState.userInfo.playlists}</span>
                            <button className='getstarted' onClick={()=> setModalState({
                                PlaylistMode : false,
                                AccountMode:true,
                                setModalState:setModalState,
                                configMode:"delete",
                                deleteType:"playlists"
                            })} style={{
                                padding:"4px 10px",
                                backgroundColor:"red",
                                width:"115px"
                            }}>Clear Playlists</button>
                            </div>
                        </div>
                        
                        <div style={{display:"flex",justifyContent:"right",gap:"5px"}}>
                            
                            <button className='getstarted' onClick={()=> setModalState({
                                PlaylistMode : false,
                                AccountMode:true,
                                setModalState:setModalState,
                                configMode:"delete",
                                deleteType:"account"
                            })} style={{
                                marginRight:"10px",
                                backgroundColor:"red",
                                width:"200px"
                            }}>Delete Account</button>
                            
                        </div>
                        
                    </div>
                    
                </div>
                
                )
            }
    }
     
}
export default PlayerList;