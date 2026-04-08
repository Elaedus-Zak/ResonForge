
import Home from './pages/Home'
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css'
import Welcome from './pages/Welcome';
import { useEffect, useState } from 'react';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

import api from './services/api';

function App() {
  const navigate = useNavigate();
  const [isLoggedin,setIsLoggedin] = useState(false);
  const [isLoading,setIsLoading] = useState(true);
  const [session,setSession]=useState("");
  async function getSession(){
    const token = localStorage.getItem("token")
    if(!token){
      setIsLoading(false)
      return
    }
    api.get("/users/session",{
    headers:{
      "Authorization":`Bearer ${token}`,
      "ngrok-skip-browser-warning": "true"
    }
  })
     .then((data)=>{
    if(data.data.isloggedin){
      setIsLoggedin(data.data.isloggedin)
      setSession(data.data.username)
    }else{
      console.log(data.data.message)
    }
    })
     .finally(()=>setIsLoading(false))
  }
  useEffect(()=>{
    getSession();
  
  
  },[])
  
  function SendUser(){
    if (isLoggedin){
      navigate("/home");
    }
    else{
      navigate("/login");
    }
  }
  if(isLoading){
    return(<div></div>)
  }
  return (
    
      <Routes>
        <Route path='/home' element={isLoggedin?<Home setSession={setSession} session={session}/>:<Navigate to={"/welcome"}/>}/>
        <Route path='/welcome' element={<Welcome SendUser={SendUser} />} />
        <Route path='/' element={<Navigate to={isLoggedin?"/home":"/welcome"}/>} />
        <Route path='/signup' element={<SignUp navigate={navigate} setIsLoggedin={setIsLoggedin} setSession={setSession}/>}></Route>
        <Route path='/login' element={<Login navigate={navigate} setIsLoggedin={setIsLoggedin} setSession={setSession}/>}></Route>
      </Routes>
    
      
  )
}

export default App
