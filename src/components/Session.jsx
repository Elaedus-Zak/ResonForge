import { LogOut } from "lucide-react";

function Session({session}){
    function handleLogout(e){
        e.stopPropagation()
        localStorage.removeItem("token");
        window.location.reload();
    }
    
    return(
    <div className='session' >
                {/*<img className='pfp' src={pfp}></img>*/}
                <div className='pfc'>
                    <span className='firstletter'><b>{session[0].toUpperCase()}</b></span>
                </div>
                <div className='username'>{session}</div>
                
                <button className="logout" onClick={handleLogout} ><LogOut color="var(--text-muted)" strokeWidth={1.5}/></button>
            </div>
    )
}
export default Session;