import placerholder from "../assets/album-placeholder.webp";
import DeleteHandler from "./DeleteHandler";
import "./SongCard.css"
function PlaylistCard({playlist , setinPlaylist,getPlaylistSongs,getPlaylists}){
    function Click(){
        console.log(playlist);
        setinPlaylist(playlist);
        getPlaylistSongs(playlist.id);
    }
    
    return(
        
        
        <div className="songcard pl" onClick={Click}>
            <img src={playlist.thumbnail===undefined?placerholder:playlist.thumbnail} className="cardcover playlist" style={{borderRadius : 10}}></img>
            <div className="cardinfo">
                <span className="cardname" style={{display : "block"}}>{playlist.name}</span>
                <span className="cardartist" style={{display : "block", height:"25px"}}>{playlist.songIds.length} Songs</span>
                <DeleteHandler ofplaylist={true} playlistId={playlist.id} getPlaylists={getPlaylists} />
            </div>
        </div>
    )
}
export default PlaylistCard;