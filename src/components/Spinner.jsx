import {motion} from "framer-motion";
function Spinner({color}){
    const setColor = color || "#282835"
    console.log(motion);
    return(
        <div className="spinner"
        style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
        }}>
            <motion.div
            animate={{rotate:360}}
            transition={{repeat:Infinity,duration:1,ease:"linear"}}
            style={{
                width:"40px",
                height:"40px",
                margin:"10px",
                borderRadius:"50%",
                border:`4px solid ${setColor}`,
                borderTopColor:"rgb(6, 85, 231)"
            }}
            />
        </div>
    )
}
export default Spinner;