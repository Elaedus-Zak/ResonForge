function SongRow({song,chosenSongs,setChosenSongs}){
    const handleCheckboxChange = (id) => {
    if (chosenSongs.includes(id)) {
        // REMOVE: Create a new array WITHOUT this ID
        const updatedList = chosenSongs.filter(item => item !== id);
        setChosenSongs(updatedList);
    } else {
        // ADD: Create a new array with all OLD items + the NEW one
        setChosenSongs([...chosenSongs, id]);
    }
};
    return(
        <div className="songrow">
            <span className="songrowname">{song.name}</span>
            <input className="songrowcheck" type="checkbox" 
            checked={chosenSongs.includes(song.id)}
            onChange={()=>handleCheckboxChange(song.id)}
            ></input>
        </div>
    )
}
export default SongRow;