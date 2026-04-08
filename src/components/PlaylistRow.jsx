import { useState } from "react";

function PlaylistRow({playlist,handleSongAdd}){
    const [indication,setIndication] = useState("");
    async function handleSelfAdding() {
        setIndication(handleSongAdd(playlist.id))
    }

    return(
        <div className="songrow butplaylist" onClick={handleSelfAdding}>
            <span className="songrowname" style={{width:"65%",textOverflow:"ellipsis"}}>{playlist.name}</span>
            <span className="indicator" style={{width:"50%",textAlign:"right"}}>{indication}</span>
        </div>
    )
}
export default PlaylistRow;