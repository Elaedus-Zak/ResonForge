import Header from "../components/Header" 
import SideBar from "../components/SideBar";
import PlayerList from "../components/PlayerList";
import PlayerBar from "../components/PlayerBar";
// import songs from "../components/Songs";
import './Home.css'
import { useState , useMemo, useEffect, useRef} from "react";
import { SearchCheck } from "lucide-react";
import api from "../services/api";
import SongRow from "../components/SongRow";
import PlaylistRow from "../components/PlaylistRow";
import Modal from "../components/Modal";

function Home({session,setSession}){
    const [currentSong ,setCurrentSong] = useState(null);
    const [activePage , setActivePage] = useState("home");
    const [inPlaylist,setinPlaylist]=useState(null);
    const [playlists,setPlaylists]=useState([]);
    const [songs,setSongs] = useState([]);
    const [IsSongsLoaded,setIsSongsLoaded]= useState(false);
    const [IsSearch,setSearch]=useState(null);
    const [IsPlaylistsLoaded,setIsPlaylistsLoaded] = useState(false);
    const [SearchSongs,setSearchSongs] =useState([]);
    const [likedIds,setLikedIds]= useState([]);
    const [IsAddPlaylistForm,setIsAddPlaylistForm]=useState(false);
    const [IsPlaylistNew,setIsPlaylistNew] = useState(true)
    const [playlistname,setPlaylistname] = useState("");
    const [selectedSongs,setSelectedSongs] = useState([]);
    const [AddSongsList,setAddSongsList] = useState([]);
    const [playlistSongs,setPlaylistSongs] = useState([]);
    const [IsPlaylistSongs,setIsPlaylistSongs] = useState(false);
    const [IsSongPlaylisting,setIsSongPlaylisting] = useState(false);
    const [thePlaylistedSong,setPlaylistedSong] =useState(null);
    const [IsRecentSongs,setIsRecentSongs] = useState(false);
    const [recentSongs,setRecentSongs] = useState([]);
    const [IsDiscover,setIsDiscover] = useState(false);
    const [discoverSongs,setDiscoverSongs]=useState([]);
    const [IsSearchinit,setIsSearchinit] = useState(false);
    const [userInfoState,setUserInfoState] = useState({userInfo:null,isloaded:false})
    const [modalState,setModalState]=useState(null);
    const eventSourceRef = useRef(null);
    //const [ItSongs,setItSongs] = useState([])
    const token = localStorage.getItem("token");
    const rendersongs= songs;
    async function search(query) {
        setIsSearchinit(true)
        setSearch(false)
        const res = await api.get(`/search?q=${query}`)
        
        setSearchSongs(res.data)
        setSearch(true)
        getLibrary();
        console.log(res.data)
        
    }
    const currentQueue = useMemo(() => {
    if (activePage === "library") return songs;
    if (activePage === "search") return SearchSongs;
    if (activePage === "playlist" && inPlaylist) {
        return songs.filter(song => inPlaylist.songIds.includes(song.id));
    }
    return [currentSong];
}, [activePage, songs, SearchSongs, inPlaylist, currentSong])
    let ItSongs = currentQueue;
// ^ Only runs when one of these specific things changes
   
    function handlePrev(){
            const currentIndex = ItSongs.indexOf(currentSong);
            if (currentIndex >0){
                setCurrentSong(ItSongs[currentIndex-1]);
            }
    
        }
    function handleNext(){
        
            console.log(rendersongs.length)
            const currentIndex = ItSongs.indexOf(currentSong)
            
            if (currentIndex < ItSongs.length-1){
                setCurrentSong(ItSongs[currentIndex+1]);
            }

    
        }
    function handleAddPlaylistForm(e){
        e.stopPropagation()
        getLibrary();
        setAddSongsList(songs);
        setIsAddPlaylistForm(true);
        setIsPlaylistNew(true);
        setIsSongPlaylisting(false);
    }
    function handleAddtoPlaylistForm(){
        
        getLibrary();
        const rendered = songs.filter(s => !inPlaylist.songIds.includes(s.id));
        setAddSongsList(rendered)
        setIsAddPlaylistForm(true);
        setIsPlaylistNew(false);
        setIsSongPlaylisting(false);
    }
    function handleAddSongtoPlaylists(song){
        getPlaylists();
        setIsAddPlaylistForm(true);
        setIsSongPlaylisting(true);
        setPlaylistedSong(song);
        setIsPlaylistNew(false);
        
    }
    async function handleSongAdd(playlistId){
        console.log(thePlaylistedSong)
        try{
            const res = await api.post("/api/playlists/songs/add",{
                playlistId:playlistId,
                fromLibrary:false,
                songIds:[],
                songData:thePlaylistedSong
            },{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
        );
        return res.data.message
        }catch(err){
            console.error(err)
        }finally{
            getPlaylistSongs(playlistId)
        }
    }
    async function getUserInfo(){
        setUserInfoState({userInfo:null,isloaded:false})
        try{
            const res = await api.get("/users/getinfo",{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        })
        setUserInfoState({userInfo:res.data,isloaded:true})
        }catch(err){
            console.error("Couldnt get user info",err)
        }
    }
    async function getLibrary() {
        setIsSongsLoaded(false);
        const res = await api.get("/api/library",{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
        );
        
        setSongs(res.data);
        setIsSongsLoaded(true);
        const likedsongs=res.data.map(song=>song.id);
        setLikedIds(likedsongs)
    }
    async function getRecentSongs(){
        setIsRecentSongs(false);
        try{
            const res = await api.get("/api/recentadds",{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
        );
        console.log(res.data)
        setRecentSongs(res.data);
        
        }catch(err){
            console.error("Server Error:",err)
        }finally{
            setIsRecentSongs(true)
        }
    }
    async function getDiscoverSongs(){
        setIsDiscover(false);
        setDiscoverSongs([])
        if(eventSourceRef.current){
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        
        
            
        const eventSource = new EventSource(`${api.defaults.baseURL}/api/discovery?token=${token}`);
        eventSourceRef.current=eventSource
        eventSource.onmessage = (e) => {
            if(!IsDiscover) setIsDiscover(true)
    if (e.data === "[DONE]") {
        eventSource.close();
        return;
    }
    const Dsong = JSON.parse(e.data);
    setDiscoverSongs(prev => [...prev, Dsong]);
};
        
        
    }
    async function getPlaylists() {
        
        try{
            setIsPlaylistsLoaded(false);
        setPlaylists([]);
        const res = await api.get("/api/playlists/",{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
        
        );
        setPlaylists(res.data);
    }catch(err){
        console.log("Couldnt fetch Playlists",err)
    }finally{
        
        setIsPlaylistsLoaded(true);
    }
    }
    async function getPlaylistSongs(playlistid) {
        try{
            
            setIsPlaylistSongs(false);
            setPlaylistSongs([]);
        const res = await api.get("/api/playlists/songs",{
            params:{
                id:playlistid
            },
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
        );
        console.log(res.data)
        setPlaylistSongs(res.data.playlistSongs);
        setinPlaylist(res.data.playlistobj)
        }catch(err){
            console.error("Couldnt send request:",err)
        }
        finally{
        
        setIsPlaylistSongs(true);
        
        }
    }
    useEffect(() => {
    
   
    if (activePage === "home") {
        getDiscoverSongs();
        getRecentSongs();
    }
    return () => {
        // cleanup when leaving home
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    };

    
}, [activePage]);
    async function AddPlaylist() {
    
    const hexId = Array.from(window.crypto.getRandomValues(new Uint8Array(6)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const playlist = { id: hexId, name: playlistname, songIds: selectedSongs };

    try {
        
        const res = await api.post("/api/playlists/add", 
            { PlaylistObj: playlist }, 
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        console.log(res.data);
    } catch (error) {
        
        console.error("Error adding playlist:", error);
    } finally {
        
        setSelectedSongs([]);
        setIsAddPlaylistForm(false);
        getPlaylists();
        setPlaylistname("");
    }
}
async function AddtoPlaylist(){
    try{
        const res = await api.post("/api/playlists/songs/add", 
            { 
                playlistId: inPlaylist.id,
                songIds: selectedSongs,
                fromLibrary:true,
                songData:null
            }, 
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        console.log(res.data);
    }catch(err){
        console.error("Error adding to playlist:", err);
    }finally{
        setSelectedSongs([]);
        setIsAddPlaylistForm(false);
        getPlaylistSongs(inPlaylist.id);
    }
}
    return(
        <div className="app">
            {modalState&&
            <Modal {...modalState} getUserInfo={getUserInfo} setSession={setSession} session={session} />
            }
            {IsAddPlaylistForm&&
            <Modal
                    PlaylistMode={true}
                    AccountMode={false}
                    IsPlaylistNew={IsPlaylistNew}
                    IsSongPlaylisting={IsSongPlaylisting}
                    playlistname={playlistname}
                    setPlaylistname={setPlaylistname}
                    AddSongsList={AddSongsList}
                    selectedSongs={selectedSongs}
                    setSelectedSongs={setSelectedSongs}
                    setIsAddPlaylistForm={setIsAddPlaylistForm}
                    AddPlaylist={AddPlaylist}
                    AddtoPlaylist={AddtoPlaylist}
                    playlists={playlists}
                    handleSongAdd={handleSongAdd}
                    setPlaylistedSong={setPlaylistedSong}
                    />
            }
            <Header setActivePage={setActivePage} search={search} />
            <div style={{
                display:"flex",
                flexDirection:"row",
                width:"100%",
                height:"91%",
                overflow:"hidden"
            }}>
            <SideBar activepage={activePage} getUserInfo={getUserInfo} inPlaylist={inPlaylist} getDiscoverSongs={getDiscoverSongs} getRecentSongs={getRecentSongs} setIsPlaylistNew={setIsPlaylistNew} setActivePage={setActivePage} session={session} setSession={setSession} getLibrary={getLibrary} getPlaylists={getPlaylists} handleAddPlaylistForm={handleAddPlaylistForm}  />
            <div className="main">
                <div className="content">
                
                <PlayerList setActivePage={setActivePage} IsSearch={IsSearch} setModalState={setModalState} userInfoState={userInfoState} IsSearchinit={IsSearchinit} discoverSongs={discoverSongs} IsDiscover={IsDiscover}  recentSongs={recentSongs} IsRecentSongs={IsRecentSongs} handleAddSongtoPlaylists={handleAddSongtoPlaylists} getPlaylists={getPlaylists} IsPlaylistSongs={IsPlaylistSongs} getPlaylistSongs={getPlaylistSongs} setPlaylistSongs={setPlaylistSongs} playlistSongs={playlistSongs} handleAddtoPlaylistForm={handleAddtoPlaylistForm} IsPlaylistsLoaded={IsPlaylistsLoaded} IsSongsLoaded={IsSongsLoaded} SelectedSong ={setCurrentSong} songs={rendersongs} activePage={activePage} inPlaylist={inPlaylist} setinPlaylist={setinPlaylist} playlists={playlists} currentSong={currentSong} likedIds={likedIds} SearchSongs={SearchSongs} />
                </div>
                
                <PlayerBar selSong={currentSong}  handleNext={handleNext} handlePrev={handlePrev} SearchSongs={SearchSongs}/>
                
            </div>    
            
        <article className="filler"></article>
        </div>
        </div>
        
    )
}
export default Home;