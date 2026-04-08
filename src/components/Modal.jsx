
import { useMemo, useState } from "react";
import PlaylistRow from "./PlaylistRow";
import SongRow from "./SongRow";
import api from "../services/api";
import { Check, CircleCheck } from "lucide-react";

function Modal({PlaylistMode,deleteType,AccountMode,configMode,getUserInfo,setSession,session,setModalState,IsSongPlaylisting,IsPlaylistNew,AddSongsList,playlists,setIsAddPlaylistForm,selectedSongs,playlistname,AddPlaylist,AddtoPlaylist,setPlaylistname,handleSongAdd,setSelectedSongs,setPlaylistedSong}){
    const deleteMsg = useMemo(()=>{
        if(deleteType==="account") return "Delete Account ?";
        if(deleteType==="library") return "Clear Library ?";
        if(deleteType==="playlists") return "Clear Playlists ?"
        if(!deleteType) return null;
    },[deleteType])
    const [newPassword,setNewPassword]= useState("");
    const [currentPassword,setCurrentPassword] = useState("");
    const [newUsername,setNewUsername] = useState("");
    const [ErrorMsg,setErrorMsg] = useState ("")
    const [IsSuccess,setIsSuccess] = useState(false);
    
    function CloseModal(){
        setModalState(null);
        setCurrentPassword("");
        setNewPassword("");
        setErrorMsg("")
    }
    async function handleChangePassword(){
        try{
            const res = await api.post("/users/changepswd",{
                newPassword: newPassword,
                currentPassword: currentPassword
            })
            console.log(res.data)
            if (res.data.success){
                setCurrentPassword("")
                setNewPassword("")
                
                setIsSuccess(true);
                setTimeout(()=>setModalState(null),1800)
                 .then(()=>setIsSuccess(false))
                console.log("AccountMode:", AccountMode, "IsSuccess:", IsSuccess)
            }else{
                setErrorMsg("Wrong Password!")
            }
        }catch(err){
            console.error("Couldnt send request",err)
        }
    }
    async function handleEditUsername(){
        try{
            if(newUsername.length>0){
            const res = await api.post("/users/editusername",{
                newUsername:newUsername
            })
            console.log(res.data)
            if (res.data.success){
                setSession(newUsername)
                setNewUsername("");
                
                setIsSuccess(true);
                setTimeout(()=>setModalState(null),1800)
                 .then(()=>{setIsSuccess(false)})
                
            }
        }else{
            setErrorMsg("Invalid Username")
        }
        }catch(err){
            console.error("Couldnt send request",err)
        }finally{
            getUserInfo();
            
        }
    }
    async function handleDelete(){
        let endpoint ;
        switch (deleteType){
            case "account":
                endpoint="/users/delete"
                break;
            case "library":
                endpoint="/api/library/clear"
                break;
            case "playlists":
                endpoint="/api/playlists/clear"
                break;        
        }
        try{
            const res = await api.post(endpoint)
            if(res.data.success){
                setIsSuccess(true);
                setTimeout(()=>{setModalState(null);window.location.reload()},1800)
                 
        }else{
            console.log(res.data)
        }
    }catch(err){
            console.error("Couldnt send request of delete",err)
        }
    }
    if (PlaylistMode){
    return(
        
        <div className="dimmer">
                <div className="addplaylistform">
                    <span style={{color:"var(--text-soft)",textAlign:"center",fontSize:"x-large"}}><b>{IsPlaylistNew?"Add a playlist":"Add to playlist"}</b></span>
                    {!IsSongPlaylisting?(
                       <> {IsPlaylistNew &&
                    <label style={{color:"var(--text-soft)"}}>Playlist Name:<br/>
                        <input style={{color:"var(--text-soft)",outline:"none",borderRadius:"8px"}} className="inform"type="text" value={playlistname} onChange={(e)=>setPlaylistname(e.target.value)}></input>
                    </label>

                    }
                    <label className="Psongslabel" style={{color:"var(--text-soft)",height: `${IsPlaylistNew?"45%":"68%"}`}}>Songs from Library<br/>
                    <div className="Psongslist" >
                        {AddSongsList?.map(song => (
                             <SongRow key={song._id || song.id} song={song} chosenSongs={selectedSongs} setChosenSongs={setSelectedSongs}/>
                            ))}
                    </div>
                    </label>
                    <div className="formcontrols">
                        <button className="getstarted" onClick={()=>{setIsAddPlaylistForm(false);setSelectedSongs([]);setPlaylistname("")}}>Cancel</button>
                        <button className="getstarted" onClick={() => (IsPlaylistNew ? AddPlaylist() : AddtoPlaylist())}>Add</button>
                        
                </div>
                    </>):(
                        <>
                        <label className="Psongslabel" style={{color:"var(--text-soft)",height: `${IsPlaylistNew?"45%":"78%"}`}}>Select Playlist:<br/>
                        <div className="Psongslist">
                            {playlists.map(playlist =>(
                                <PlaylistRow key={playlist.id} handleSongAdd={handleSongAdd} playlist={playlist}/>
                            ))}
                        </div>
                        </label>
                        <button className="getstarted" onClick={()=>{setIsAddPlaylistForm(false);setPlaylistedSong(null);}}>Close</button>
                        </>
                    )}
                    
                    </div>
            </div>
    )
}
 if (AccountMode){
if (IsSuccess){
        return(
    <div className="dimmer">
            <div className="addplaylistform" style={{height:"225px",justifyContent:"center",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",flexDirection:"column"}}>
                    <CircleCheck strokeWidth={4} color="green" size={30}/>
                    <span style={{color:"green",fontSize:"medium"}}>Success</span>
                </div>
            </div>
        </div>
        )
}
    else{
    if(configMode==="changepswd"){
        return(
        <div className="dimmer">
            <div className="addplaylistform" style={{height:"340px"}}>
                <span style={{color:"var(--text-soft)",textAlign:"left",fontSize:"x-large"}}><b>Change Password</b></span>
                <span style={{color:"red",textAlign:"left",height:"10px"}}>{ErrorMsg}</span>
                <label style={{color:"var(--text-soft)"}}>Current Password:<br/>
                        <input style={{color:"var(--text-soft)",outline:"none",borderRadius:"8px"}} className="inform"type="text" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} ></input>
                    </label>
                <label style={{color:"var(--text-soft)"}}>New Password:<br/>
                    <input style={{color:"var(--text-soft)",outline:"none",borderRadius:"8px"}} className="inform"type="text" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} ></input>
                </label>
                <div className="formcontrols">
                <button className="getstarted" onClick={CloseModal}>Cancel</button>
                <button className="getstarted" onClick={handleChangePassword}>Confirm</button>
                </div>
            </div>
        </div>
    )
    }
    if(configMode==="usernameedit"){
        return(
            <div className="dimmer">
            <div className="addplaylistform" style={{height:"290px"}}>
                <span style={{color:"var(--text-soft)",textAlign:"left",fontSize:"x-large"}}><b>Edit Username</b></span>
                
                <span style={{color:"var(--text-soft)",textAlign:"left",height:"10px"}}>Current Username: {session}</span>
                <span style={{color:"red",textAlign:"left",height:"10px"}}>{ErrorMsg}</span>
                <label style={{color:"var(--text-soft)"}}>New Username:<br/>
                        <input style={{color:"var(--text-soft)",outline:"none",borderRadius:"8px"}} className="inform"type="text" value={newUsername} onChange={(e)=>{setNewUsername(e.target.value)}}></input>
                    </label>
                
                <div className="formcontrols" style={{marginTop:"12px"}}>
                <button className="getstarted" onClick={()=> setModalState(null)}>Cancel</button>
                <button className="getstarted" onClick={()=> handleEditUsername()}>Confirm</button>
                </div>
            </div>
        </div>
        )
    }
    if (configMode==="delete"){
        return(
        <div className="dimmer">
            <div className="addplaylistform" style={{height:"225px"}}>
                <span style={{color:"var(--text-soft)",textAlign:"left",fontSize:"x-large"}}><b>{deleteMsg}</b></span>
                
                <span style={{color:"var(--text-soft)",textAlign:"left"}}>Are you sure you want to take this action ? it can not be undone</span>
                
                
                <div className="formcontrols" style={{marginTop:"12px"}}>
                <button className="getstarted" onClick={()=> setModalState(null)}>Cancel</button>
                <button className="getstarted" style={{backgroundColor:"red"}} onClick={()=> handleDelete()}>Confirm</button>
                </div>
            </div>
        </div>
        )
    }
}
}

}
export default Modal;