import "@functions/getPlaylists"
import "./Search.css"
import { getPlaylists } from "@functions/getPlaylists";
import React, { useState, useEffect} from 'react';



function Search() {
    const [searchQuery, setSearchQuery] = useState('');


    // Function to handle input change
    const handleInputChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            getPlaylists(searchQuery)
        }, 1000)
    
        return () => clearTimeout(timer)
      }, [searchQuery])


    return (
        <div className="Search">
            <input onChange={handleInputChange} className="form-control mr-sm-2 input-large" type="search" placeholder="Search" aria-label="Search"/>
        </div>
    );
}

export default Search;