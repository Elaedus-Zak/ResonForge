import { Home, Library, ListMusic ,Plus, Search, User} from 'lucide-react';
import Session from './Session';

//import pfp from "../assets/pfp.jpg"

function SideBar({handleAddPlaylistForm,getUserInfo,getRecentSongs,getDiscoverSongs,activepage,inPlaylist ,setActivePage,session,getLibrary,getPlaylists}){
    
    
   async function LoadHome(){
        
        await getDiscoverSongs();
        await getRecentSongs();
        setActivePage("home");
    }
    return(
        <div className="sidebar">
            
            <Session session={session} setActivePage={setActivePage}/>
            <div className="sidebarbtns">
                <button className={activepage === "home" ? "sidebtn chos" : "sidebtn"} onClick={()=>LoadHome()}><Home size={20} strokeWidth={1.5}/> Home</button>
                <button className={activepage === "search" ? "sidebtn chos" : "sidebtn"} onClick={()=>{setActivePage("search");}}><Search size={20} strokeWidth={1.5}/> Search</button>
                <button className={activepage === "library" ? "sidebtn chos" : "sidebtn"} onClick={()=>{setActivePage("library");getLibrary();}}><Library size={20} strokeWidth={1.5}/> Library</button>
                <button className={activepage === "playlist" ? "sidebtn chos" : "sidebtn"} onClick={()=>{setActivePage("playlist");getPlaylists();}}><ListMusic size={20} strokeWidth={1.5}/> Playlist<button className={activepage === "playlist" ? (inPlaylist?"addplaylist dis":"addplaylist") : "addplaylist dis"} onClick={handleAddPlaylistForm}><Plus size={18} /></button></button>
                <button className={activepage === "account" ? "sidebtn chos" : "sidebtn"} onClick={()=>{setActivePage("account");getUserInfo();}}><User size={20} strokeWidth={1.5}/> Account</button>
            </div>
            
        </div>
    )
}
export default SideBar;