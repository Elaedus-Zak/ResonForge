import "./Welcome.css"
function Welcome({SendUser}){
    return(
        <div className="welcome">
        <div className="mainw">
              
            <div className="titlew">Reson<span style={{ color: "#053da5ff" ,textOverflow:"ellipsis"}}>Forge</span></div>
            
            <div style={{textAlign:"center"}}>Discover music from across the web and start listening instantly.<br/>
                Search for any song, artist, or video and play it with no interruptions.<br/>
                Build your playlists, explore new sounds, and shape your personal music experience.</div>
            <button className="getstarted" onClick={SendUser}>Get Started</button>  
        </div>  
    </div>
    )
            
}
export default Welcome;