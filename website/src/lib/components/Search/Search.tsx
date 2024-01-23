import "@functions/getPlaylists";
import List from "@components/List";
import "./Search.css";
import { getPlaylists } from "@functions/getPlaylists";
import { useState, useEffect } from "react";
import { Playlist } from '@/lib/interfaces'; // Import the interface


function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    // Function to handle input change
    const handleInputChange = (event: any) => {
        setSearchQuery(event.target.value);
        // console.log(searchQuery)
    };

    async function handleGetPlaylists() {
        // console.log(searchQuery)
        const response = await getPlaylists(searchQuery);
        setPlaylists(response);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            handleGetPlaylists();
        }, 700);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <>
            <div className="search">
                <div className="search-bar">
                    <h1>Songlify</h1>
                    <input
                        onChange={handleInputChange}
                        className="form-control mr-sm-2 input-large"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                </div>
                <List val={playlists}/>
            </div>
        </>
    );
}

export default Search;
