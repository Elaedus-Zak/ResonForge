import { useState } from "react";
import "./Auth.css"
import { Link } from 'react-router-dom';
import api from "../services/api";
function SignUp({navigate,setSession,setIsLoggedin}){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [rPassword,setrPassword] = useState("");
    const [stopaccess,setStopAccess]= useState(false);
    const [stopmessage,setStopMessage]=useState("");
    async function handleSubmit(e){
        e.preventDefault()
        if(password===rPassword){
            if(username.length<1){
                setStopAccess(true)
                setStopMessage("Username Invalid")
            }else if(password.length<4){
                setStopAccess(true)
                setStopMessage("Password invalid , it must at least 4 characters")
            }else{
                const userData = {username:username,password:password};
            const auth = await api.post("/users/register",userData);
            
            if(auth.data.loggedin){
                console.log(auth.data.message);
                console.log(auth.data.token);
                localStorage.setItem("token",auth.data.token);
                setIsLoggedin(true);
                setSession(userData.username);
                navigate("/home");
            }else{
                setStopAccess(true)
                setStopMessage(auth.data.message);
            }
            }
        }else{
            setStopAccess(true)
            setStopMessage("You didn't repeat the password correctly");
        }
    }
    return(
        <div className="authp">
             <div className="maina">
                <div className="titlew auth">Reson<span style={{ color: "#053da5ff" ,textOverflow:"ellipsis"}}>Forge</span></div>
             <form className="form signup" onSubmit={handleSubmit}>
                <p style={{width:"100%" ,textAlign:"center", scale:"180%"}}><b>Create An Account</b></p>
                <p style={{color:"red",height:"25px",padding:"0",display:"flex"}}>{stopaccess?stopmessage:"‎ "}</p>
                <div className="inputs">
                    <label>Username :<br/>
                    <input className="inform" type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}}></input>
                </label>
                
                <label>Password :<br/>
                    <input className="inform"  type="text" value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
                </label>
                
                <label>Repeat Password :<br/>
                    <input className="inform"  type="text" value={rPassword} onChange={(e)=>{setrPassword(e.target.value)}}></input>
                </label>
                <input className="getstarted auths" value={"Sign Up"} type="submit"></input>
                </div>
                
             </form>
             <div className="alt">Already have an account? <Link to="/login">Login</Link></div>
             </div>
        </div>
    )
}
export default SignUp;