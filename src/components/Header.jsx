import { Search } from "lucide-react";
import { useState } from "react";


function Header({setActivePage,search}){
    const [query,setQuery] = useState("");
    return(
        <header className="header">
            <div className='title'>
                <div>Reson<span style={{ color: "var(--brand-glow)" ,textOverflow:"ellipsis"}}>Forge</span></div>
            </div>
            <div className="search-wrapper">
                <Search strokeWidth={1.5} color="var(--text-muted)"/>
                <input placeholder="Search for songs..." type="text" id="search"
            value={query} // This makes it "controlled"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === 'Enter') {
            console.log("Enter pressed!");
            setActivePage("search");
            search(query)    
             // yourSearchFunction(e.target.value);
            }
            }}
            ></input>
            </div>
            
        </header>
    )
}   
export default Header;