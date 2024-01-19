// import { Link, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./SongsPages.css";
import { useLocation } from "react-router-dom";
import React, { useState, FormEvent, useEffect } from 'react';
import { getSongs } from "@/lib/functions/getSongs";

function SongsPage() {
    // TO DO:
    // call getSongs using url ?id=
    // allow webpage to be reached outside of search

    // let { id } = useParams();
    const [guessVal, setGuessVal] = useState<string>('')

    const location = useLocation();
    const playlist = location.state.playlist;

    const allowedAttempts = 6;
    var attempts = 0;

    var guesses = ["", "", "", "", "", ""];

    const songs = getSongs(playlist.id);

    function returnQuery() {
        for (let i = 0; i < songs.length; i++) {

        }
    }

    function handleSearch(event) {
        setGuessVal(event.target.value);
        returnQuery()
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
                    <img src={playlist.image} alt="spotiy-playlist-image"/>
                    <h2>{playlist.name}</h2>
                </div>

                <div className="guesses">
                    {guesses.map((guess, index) => (
                        <div className="guess-row" key={`guess-${index}`}>{guess}</div>
                    ))}
                </div>
                 
                <div id="search-bar" className="form-group">
                        <input onChange={handleSearch} type="guess" className="form-control" placeholder="Guess it. Search for the song."/>
                        <small id="emailHelp" className="form-text text-muted"></small>
                        <button type="submit" className="btn btn-primary">Submit</button>
                </div>
                
                <div className="actions">
                    <div className="skip">

                    </div>
                    <div className="media">

                    </div>
                </div>

                <div className="progess-bar">

                </div>
            </div>
        </>
    );
}

export default SongsPage;
