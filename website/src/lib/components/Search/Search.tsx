import "@functions/getPlaylists";
import List from "@components/List";
import "./Search.css";
import { getPlaylists } from "@functions/getPlaylists";
import { useState, useEffect } from "react";
import { Playlist } from '@/lib/interfaces'; // Import the interface


function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator


    // Function to handle input change
    const handleInputChange = (event: any) => {
        setSearchQuery(event.target.value);
        // console.log(searchQuery)
    };

    async function handleGetPlaylists() {
        // console.log(searchQuery)
        setIsLoading(true); // Show loading indicator
        try {
            const response = await getPlaylists(searchQuery);
            setPlaylists(response);
            setIsLoading(false); // Hide loading indicator in case of error
        }
        catch (error) {
            console.error("Error fetching playlists", error);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            handleGetPlaylists();
        }, 100);

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
                    {playlists.length === 0 ? <div>Type in a Spotify playlist or link</div>: null}
                    {isLoading ? <div>Loading...</div> : null}
                    <List val={playlists}/>
                </div>
            </div>
        </>
    );
}

export default Search;
