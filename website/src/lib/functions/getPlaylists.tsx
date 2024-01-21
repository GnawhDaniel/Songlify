export async function getPlaylists(query: string) {
    if (query === "") {
        return []
    }

    var spotify = "";
    const endpoint = import.meta.env.VITE_SERVER;
    let encodedQuery = encodeURIComponent(query);
    let playlists = []
    
    if (query.includes("https://open.spotify.com/playlist")){
        const regex = /playlist\/([a-zA-Z0-9]+)(?:\?|$)/;
        const matches = query.match(regex);
        console.log("test", matches)
        if (!matches){
            return []
        }

        spotify = `${endpoint}/auth/getSinglePlaylist?playlist=${encodeURIComponent(matches[1])}`;
        try {
            const response = await fetch(spotify);
            let data = await response.json();
            playlists.push({
                name: data["name"],
                image: data["images"][0]["url"],
                owner: data["owner"]["display_name"],
                id: data["id"]
            })
        } catch (error) {}

    }
    else {
        spotify = `${endpoint}/auth/getPlaylists?name=${encodedQuery}`;
        try {
            const response = await fetch(spotify);
            let data = await response.json();
            data = data['playlists']['items']
            for (let i = 0; i < data.length; i++) {
                playlists.push({
                    name: data[i]["name"],
                    image: data[i]["images"][0]["url"],
                    owner: data[i]["owner"]["display_name"],
                    id: data[i]["id"],
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    



    return playlists
};

