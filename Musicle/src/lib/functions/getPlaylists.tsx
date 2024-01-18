export async function getPlaylists(query: string) {
    if (query.includes("https://open.spotify.com/playlist")){
        // return exact match
    }
    
    let encodedQuery = encodeURIComponent(query);
    const endpoint = import.meta.env.VITE_SERVER;
    const spotify = `${endpoint}/auth/getPlaylists?name=${encodedQuery}`

    console.log(spotify);

    try {
        const response = await fetch(spotify);
        const data = await response.json();
        console.log(data);
        // Process the data
    } catch (error) {
        console.error('Error:', error);
    }
};

