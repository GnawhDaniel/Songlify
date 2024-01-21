// import { Link, useParams } from "react-router-dom";
import { getSongs } from "@/lib/functions/getSongs";
import React, { useState, useEffect, useRef } from "react";
import PlayButton from "@/assets/play-button.svg";
import SkipButton from "@/assets/skip-icon.svg";
import PauseButton from "@/assets/pause-button.svg";
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
    const randomNum = location.state.randomNumber;

    const [randomNumber, setRandNum] = useState<number>(randomNum);
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

    const times = [1, 2, 4, 7, 11, 16, 30];
    const [counter, setCounter] = useState<number>(0);
    const [randomSong, setRandomSong] = useState<Songs>();
    const audioRef = useRef<HTMLAudioElement | null>(null); // Ref for the audio element
    const [paused, setPaused] = useState(true);
    const [win, setWin] = useState(false);
    const [endGame, setEndGame] = useState(false);

    var [progress, setProgress] = useState(0);

    const allowedAttempts = 6;

    // useEffect for cleaning up the audio on route change or component unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = ''; // Release the audio resources
                audioRef.current = null;
            }
        };
    }, [location]); // Dependency on location to detect route change

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
            audioRef.current = new Audio(selectedSong["preview"]);
        }
    }, [songs, randomNumber]);

    // Progress Bar
    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current && !audioRef.current.paused) {
                // console.log(audio.currentTime)
                setProgress(audioRef.current.currentTime);
            }
        }, 15); // Check every 100 milliseconds

        return () => clearInterval(interval);
    }, [audioRef]);

    // Pause
    useEffect(() => {
        const checkTime = () => {
            console.log(counter);
            if (audioRef.current && audioRef.current.currentTime >= times[counter]) {
                audioRef.current.pause();
                setPaused(true);
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener("timeupdate", checkTime);
        }

        // Cleanup function to remove the event listener
        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener("timeupdate", checkTime);
            }
        };
    }, [audioRef.current, counter]); // Dependencies: audio and counter

    // Handler Functions
    function handleEndMusic() {
        setCounter(times.length - 1);
        audioRef.current?.play();
    }

    function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setGuessVal(event.target.value);
        returnQuery(songs, guessVal);
    }

    function handleSelect(song: string) {
        setGuessVal(song);
    }

    function handlePlay() {
        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0.45;
            audioRef.current.play();
            setPaused(false);
        }
    }

    function getWinState() {
        if (
            randomSong &&
            guessVal === `${randomSong["artist"]} - ${randomSong["songName"]}`
        ) {
            setWin(true);
            setEndGame(true);
        }
        if (counter >= allowedAttempts - 1) {
            setEndGame(true);
        }
    }

    function handlePause() {
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            setPaused(true);
        }
    }

    function handleSkip() {
        guessArray[counter] = "Skipped.";
        setGuessArray(guessArray);
        setCounter(counter + 1);
        getWinState();
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (endGame) {
            return;
        }
        // add if statement for win or loss
        for (let i = 0; i < songs.length; i++) {
            var currSong = `${songs[i]["artist"]} - ${songs[i]["songName"]}`;
            if (currSong.includes(guessVal) && currSong === guessVal) {
                getWinState();

                var arr = guessArray;
                arr[counter] = guessVal;
                setGuessArray(arr);
                setCounter(counter + 1);
                setGuessVal("");
            }
        }
    }

    function restartPlaylist() {
        setRandNum(Math.random());
        setGuessVal("");
        setGuessArray(["", "", "", "", "", ""]);
        setCounter(0);
        audioRef.current?.pause();
        setPaused(true);
        setWin(false);
        setEndGame(false);
    }

    return (
        <>
            <nav className="navbar navbar-dark bg-dark">
                <Link className="m-1" to="/">
                    Songlify
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
                            <i>{guess}</i>
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

                <div className="progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${(progress / times[5]) * 101}% `,
                        }}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    ></div>
                </div>

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
                        onClick={() => {
                            paused ? handlePlay() : handlePause();
                        }}
                        draggable="false"
                        src={paused ? PlayButton : PauseButton}
                        alt=""
                    />
                </div>
            </div>
            {endGame && randomSong && (
                <div className="overlay" onLoad={handleEndMusic}>
                    <div className="popup">
                        <img src={randomSong["image"]} alt="" />
                        <div className="end-text">
                            <b>{win ? "Winner!" : "Better Luck Next Time."}</b>
                            <i>
                                {randomSong["songName"]} by{" "}
                                {randomSong["artist"]}
                            </i>
                        </div>
                        <div className="links">
                            <Link
                                className="btn btn-primary"
                                onClick={restartPlaylist}
                                to={"/"}
                            >
                                Back Home?
                            </Link>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={restartPlaylist}
                            >
                                Same Playlist?
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SongsPage;
