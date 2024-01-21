import React, { useState, useEffect, useRef } from 'react';

const Test = () => {
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);
    const intervalRef = useRef(null);

    const updateProgress = () => {
        if (audioRef.current) {
            const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(currentProgress);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        intervalRef.current = setInterval(updateProgress, 50); // Update every 100ms

        audio.addEventListener('ended', () => {
            clearInterval(intervalRef.current);
            setProgress(0);
        });

        return () => {
            clearInterval(intervalRef.current);
            audio.removeEventListener('ended');
        };
    }, []);

    return (
        <>
            <audio
                ref={audioRef}
                src="https://p.scdn.co/mp3-preview/6fc68c105e091645376471727960d2ba3cd0ee01?cid=abf1ad887b154dee9a8dc0b5b217ce90"
                controls
                onPlay={() => intervalRef.current = setInterval(updateProgress, 100)}
                onPause={() => clearInterval(intervalRef.current)}
            />
            <div style={{ width: '25%', height: '30px', backgroundColor: '#ddd' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'blue' }} />
            </div>
        </>
    );
};

export default Test;