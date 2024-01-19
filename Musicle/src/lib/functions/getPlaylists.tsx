export async function getPlaylists(query: string) {
    if (query === "") {
        return []
    }

    if (query.includes("https://open.spotify.com/playlist")){
        // return exact match
    }

    let encodedQuery = encodeURIComponent(query);
    const endpoint = import.meta.env.VITE_SERVER;
    const spotify = `${endpoint}/auth/getPlaylists?name=${encodedQuery}`
    let playlists = []

    try {
        const response = await fetch(spotify);
        let data = await response.json();
        data = data['playlists']['items']
        for (let i = 0; i < data.length; i++) {
            playlists.push({
                name: data[i]["name"],
                image: data[i]["images"][0]["url"],
                owner: data[i]["owner"]["display_name"],
                uri: data[i]["uri"]
            })
        }
    } catch (error) {
        console.error('Error:', error);
    }

    return playlists
};

