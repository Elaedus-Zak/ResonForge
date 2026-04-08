import { useState } from "react";
import "./Auth.css"
import { Link } from 'react-router-dom';

import api from "../services/api";
function Login({navigate,setIsLoggedin,setSession}){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [stopaccess,setStopAccess] = useState(false);
    async function handleSubmit(e){
        e.preventDefault()
        const userData = {username:username.trim(),password:password.trim()}
        
        const auth = await api.post("/users/login",userData);
        if (auth.data.token){
            console.log(auth.data.token)
            localStorage.setItem("token",auth.data.token)
            navigate("/home")
            setIsLoggedin(true)
            setStopAccess(false)
            setSession(userData.username)
        }else{
            console.log("user name or password are incorrect")
            setStopAccess(true)
        }
    }
    return(
        <div className="authp">
             <div className="maina login">
                <div className="titlew auth">Reson<span style={{ color: "#053da5ff" ,textOverflow:"ellipsis"}}>Forge</span></div>
             <form className="form login" onSubmit={handleSubmit}>
                <p style={{width:"100%" ,textAlign:"center", scale:"180%"}}><b>Log in to An Account</b></p>
                
                <span style={{color:"red",height:"24px",padding:"0",margin:"0"}}>{stopaccess?"Username or password is incorrect !":""}</span>
                <div className="inputs">
                    <label>Username :<br/>
                    <input className="inform" type="text"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    ></input>
                </label>
                
                <label>Password :<br/>
                    <input className="inform"  type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    ></input>
                </label>
                
                <input className="getstarted auths" value={"Log in"} type="submit"></input>
                </div>
                
             </form>
             <div className="alt">Don't have an account? <Link to="/signup">Sign Up</Link></div>
             </div>
        </div>
    )
}
export default Login;