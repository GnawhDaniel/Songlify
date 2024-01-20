// import { Link, useParams } from "react-router-dom";
import { getSongs } from "@/lib/functions/getSongs";
import React, { useState, useEffect } from "react";
import PlayButton from "@/assets/play-button.svg";
import SkipButton from "@/assets/skip-icon.svg";
import { useLocation } from "react-router-dom";
import { Songs } from "@/lib/interfaces";
import { Link } from "react-router-dom";
import "./SongsPages.css";

import { returnQuery } from "@/lib/functions/returnQuery";

function SongsPage() {
    // TO DO:
    // call getSongs using url ?id=
    // allow webpage to be reached outside of search function (direct links)

    // let { id } = useParams();
    const location = useLocation();
    const playlist = location.state.playlist;

    const [guessVal, setGuessVal] = useState<string>("");
    const [songs, setSongs] = useState<Songs[]>([]);
    const [guessArray, setGuessArray] = useState<string[]>([
        "",
        "",
        "",
        "",
        "",
        "",
    ]);

    const times = [1, 2, 4, 7, 11, 16, 21]
    const [counter, setCounter] = useState<number>(0);
    const allowedAttempts = 6;

    // Fetch the songs when the component mounts or playlist.id changes
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const fetchedSongs = await getSongs(playlist.id);
                setSongs(fetchedSongs);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        };

        fetchSongs();
    }, [playlist.id]);


    // function returnQuery() {
    //     if (guessVal === "") {
    //         return [];
    //     }
    //     var valid = [];
    //     for (let i = 0; i < songs.length; i++) {
    //         var track = `${songs[i]["artist"]} - ${songs[i]["songName"]}`;
    //         var trackLower = track.toLowerCase();
    //         if (trackLower.includes(guessVal.toLowerCase())) {
    //             valid.push(track);
    //         }
    //     }
    //     return valid;
    // }

    function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setGuessVal(event.target.value);
        returnQuery(songs, guessVal);
    }

    function handleLoss() {}

    // function handleWin() {}

    function handleSelect(song: string) {
        setGuessVal(song);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // add if statement for win or loss

        for (let i = 0; i < songs.length; i++) {
            if (
                `${songs[i]["artist"]} - ${songs[i]["songName"]}}`.includes(
                    guessVal
                )
            ) {
                if (counter >= allowedAttempts) {
                    handleLoss();
                }

                var arr = guessArray;
                arr[counter] = guessVal;
                setGuessArray(arr);
                setCounter(counter + 1);
                setGuessVal("");
            }
        }
    }

    return (
        <>
            <nav className="navbar navbar-dark bg-dark">
                <Link className="m-1" to="/">
                    SonGuess
                </Link>
            </nav>

            <div className="songs-page">
                <div className="playlist-info">
                    <img src={playlist.image} alt="spotiy-playlist-image" />
                    <h2>{playlist.name}</h2>
                </div>

                <div className="guesses">
                    {guessArray.map((guess, index) => (
                        <div className="guess-row" key={`guess-${index}`}>
                            {guess}
                        </div>
                    ))}
                </div>

                <div className="search-results">
                    <div className="dropup-content border border-2 overflow-auto">
                        {returnQuery(songs, guessVal).map((song, index) => (
                            <div
                                onClick={() => handleSelect(song)}
                                className="dropup-items border border-1"
                                id={`${index}}`}
                            >
                                {song}
                            </div>
                        ))}
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    id="search-bar"
                    className="form-group"
                >
                    <input
                        autoComplete="off"
                        onChange={handleSearch}
                        type="guess"
                        id="user-guess"
                        className="form-control"
                        placeholder="Guess it. Search for the song."
                        value={guessVal ? guessVal : ""}
                    />
                    <small
                        id="emailHelp"
                        className="form-text text-muted"
                    ></small>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>

                <div className="progess-bar"></div>

                <div className="actions">
                    <img className="skip" onClick="" draggable="false" src={SkipButton} alt="" />
                    <img className="play-pause" onClick="" draggable="false" src={PlayButton} alt="" />
                </div>


            </div>
        </>
    );
}

export default SongsPage;
