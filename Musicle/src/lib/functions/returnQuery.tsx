import { Songs } from "@lib/interfaces/index";

export function returnQuery(songs: Songs[], guessVal: string) {
    if (guessVal === "" || !songs) {
        return [];
    }

    var valid = [];
    for (let i = 0; i < songs.length; i++) {
        var track = `${songs[i]["artist"]} - ${songs[i]["songName"]}`;
        var trackLower = track.toLowerCase();
        if (trackLower.includes(guessVal.toLowerCase())) {
            valid.push(track);
        }
    }
    return valid;
}