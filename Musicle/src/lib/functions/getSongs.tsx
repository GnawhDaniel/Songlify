export async function getSongs(query: string) {
    if (query === "") {
        return []
    }

    if (query.includes("https://open.spotify.com/playlist")){
        // return exact match
    }

    let encodedQuery = encodeURIComponent(query);
    const endpoint = import.meta.env.VITE_SERVER;
    const spotify = `${endpoint}/auth/getTracks?name=${encodedQuery}`
    let tracks = [];

    try {
        const response = await fetch(spotify);
        let data = await response.json();
        // console.log("data", data["items"][0]["track"]["artists"][0]["name"])
        data = data["items"]
        for (let i = 0; i < data.length; i++) {
            tracks.push({
                artist: data[i]["track"]["artists"][0]["name"],
                songName: data[i]["track"]["name"]
            })
        }
    } catch (error) {
        console.error('Error:', error);
    }

    return tracks
};

