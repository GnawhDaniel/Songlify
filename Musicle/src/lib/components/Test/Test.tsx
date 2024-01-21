import { useState, useEffect} from "react";

function Test2() {
    var a = new Audio("https://p.scdn.co/mp3-preview/6fc68c105e091645376471727960d2ba3cd0ee01?cid=abf1ad887b154dee9a8dc0b5b217ce90")
    var [audio, setAudio] = useState(a)
    var [progress, setProgress] = useState(0)
    
    useEffect(() => {
        const interval = setInterval(() => {
            if (audio) {
                console.log(audio.currentTime)
                setProgress(audio.currentTime)
            }
        }, 100); // Check every 100 milliseconds
    
        return () => clearInterval(interval);
    }, [audio]);

    const startPlayback = () => {
        if (audio) {
            audio.play().catch(error => console.error('Playback failed:', error));
        }
    };

    return (
        <>
            <button onClick={startPlayback}>Play</button>
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{width: `${(progress / audio.duration) * 100}% `}}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
            </div>
        </>
    );
}

export default Test2;


