import { useState } from "react";

function Clear(){
    const [IsCalled,setIsCalled] = useState(false)
    return(
        <div className="clear">
            <button className='getstarted' onClick={()=>{setIsCalled(true)}} style={{
                                padding:"4px 10px",
                                backgroundColor:"red",
                            }}>Clear Library</button>
            <div className="call">
               
               </div>      
        </div>
    )
}
export default Clear;