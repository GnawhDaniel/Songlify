// import { Link, useParams } from "react-router-dom";
import { getSongs } from "@/lib/functions/getSongs";
import React, { useState, useEffect } from "react";
import PlayButton from "@/assets/play-button.svg";
import SkipButton from "@/assets/skip-icon.svg";
import PauseButton from "@/assets/pause-button.svg";
import { useLocation } from "react-router-dom";
import { Songs } from "@/lib/interfaces";
import { Link } from "react-router-dom";
import "./SongsPages.css";

import { returnQuery } from "@/lib/functions/returnQuery";
import { getEmbed } from "@/lib/functions/getEmbed";

function SongsPage() {
    // TO DO:
    // call getSongs using url ?id=
    // allow webpage to be reached outside of search function (direct links)

    // let { id } = useParams();
    const location = useLocation();
    const playlist = location.state.playlist;
    const randomNumber = location.state.randomNumber;

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

    const times = [1, 2, 4, 7, 11, 16, 21];
    const [counter, setCounter] = useState<number>(0);
    const [randomSong, setRandomSong] = useState<Songs>();
    const [audio, setAudio] = useState<HTMLAudioElement>();
    const [paused, setPaused] = useState(true);
    const [win, setWin] = useState(false);
    const [endGame, setEndGame] = useState(false);
    // const [embed, setEmbed] = useState<string>("<div></div>");

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

    // Pick Random Song from Songs Array
    useEffect(() => {
        if (songs.length > 0) {
            const selectedSong = songs[Math.floor(randomNumber * songs.length)];
            setRandomSong(selectedSong);
            setAudio(new Audio(selectedSong["preview"]));
        }
    }, [songs]);
    
    // // Get Embed
    // useEffect(() => {
    //     const getEmbedded = async () => {
    //         try {
    //             if (randomSong && randomSong["url"]) {
    //                 console.log(randomSong["url"]);
    //                 const fetchedEmbed = await getEmbed(randomSong["url"]);
    //                 console.log(fetchedEmbed);

    //                 setEmbed(fetchedEmbed)
    //                 console.log("here")
    //                 console.log(embed)
    //             }
    //         } catch (error) {
    //             console.error("Error fetching embed:", error);
    //         }
    //     };

    //     getEmbedded();
    // }, [ randomSong?.["url"] ]);
    
    
    // Handler Functions
    function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setGuessVal(event.target.value);
        returnQuery(songs, guessVal);
    }

    function handleSelect(song: string) {
        setGuessVal(song);
    }

    function handlePlay() {
        if (audio && audio.paused) {
            audio.currentTime = 0;
            audio.volume = 0.45;
            audio.play();
            setPaused(false);
            setTimeout(() => {
                audio.pause();
                setPaused(true);
            }, times[counter] * 1000);
        } else {
        }
    }

    function handlePause() {
        if (audio && !audio.paused) {
            audio.pause();
            setPaused(true);
        }
    }

    function handleSkip() {}

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (endGame) {
            return
        }
        // add if statement for win or loss
        for (let i = 0; i < songs.length; i++) {
            var currSong = `${songs[i]["artist"]} - ${songs[i]["songName"]}`;
            if (currSong.includes(guessVal) && currSong === guessVal) {
                if (
                    randomSong &&
                    guessVal ===
                        `${randomSong["artist"]} - ${randomSong["songName"]}`
                ) {
                    setWin(true);
                    setEndGame(true);
                }
                if (counter === allowedAttempts - 1) {
                    setEndGame(true);
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
                    <img src={playlist.image} alt="spotify-playlist-image" />
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
                    <img
                        className="skip"
                        onClick={() => handleSkip()}
                        draggable="false"
                        src={SkipButton}
                        alt=""
                    />
                    <img
                        className="play-pause"
                        onClick={() => {paused ? handlePlay() : handlePause()}}
                        draggable="false"
                        src={paused ? PlayButton : PauseButton}
                        alt=""
                    />
                </div>
            </div>
            {endGame && randomSong && (
                <div className="overlay">
                    <div className="popup">
                        <img src={randomSong["image"]} alt="" />
                        <div className="end-text">
                            <b>{win ? "Winner!" : "Better Luck Next Time."}</b>
                            <i>{randomSong["songName"]} by {randomSong["artist"]}</i>
                        </div>
                        {/* <div dangerouslySetInnerHTML={{__html: embed}}/> */}
                    </div>
                </div>
                
            )}
        </>
    );
}

export default SongsPage;
