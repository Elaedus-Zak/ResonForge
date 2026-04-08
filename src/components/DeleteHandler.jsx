import { Check, Trash, X } from "lucide-react";
import { useState } from "react";
import "./DeleteHandler.css"
import api from "../services/api";
function DeleteHandler({playlistId,getPlaylists,ofplaylist,songId,getPlaylistSongs}){
    const token = localStorage.getItem("token")
    const [IsCalled,setIsCalled] = useState(false);
    function DeleteCall(e){
        e.stopPropagation();
        setIsCalled(true)
    }
    function DeleteReject(e){
        e.stopPropagation();
        setIsCalled(false)
    }
    async function DeleteResolve(e){
        e.stopPropagation();
        
        if(ofplaylist){
            try{ const res = api.post("/api/playlists/remove",{playlistId:playlistId},
            {
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            }
            )
            if((await res).data.success){
                await getPlaylists();
            }
        console.log(res.data);
        }catch(err){
            console.log("Couldnt Send Request :",err)
        }finally{
            setIsCalled(false);
            
        }
        }else{
            try{
                const res = api.post("/api/playlists/songs/remove",{playlistId:playlistId,songId:songId},
            {
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            }
            )

            console.log(res.data);
            if((await res).data.success){
                await getPlaylistSongs(playlistId);
            }
            }catch(err){
                console.log("Couldnt send request :",err)
            }finally{
                
                setIsCalled(false);
                
            }
        }
    }
    return(
        <div className={ofplaylist?"deletehandler":"deletehandler inS"}>
            
            {IsCalled ?(
            <button className="deleterejecter" onClick={DeleteReject}><X size={20} strokeWidth={1.5} color="red"/></button>
            ):(<button className="deletecaller" onClick={DeleteCall}><Trash size={20} strokeWidth={1.5} color="red"/></button>)
            }
            {IsCalled &&
            <button className="deleteresolver" onClick={DeleteResolve}><Check size={20} strokeWidth={1.5} color="green"/></button>

            }
        </div>
    )
}
export default DeleteHandler;