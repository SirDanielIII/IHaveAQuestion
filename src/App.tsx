import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';

type Screen = 'prompt' | 'valentine' | 'final' | 'rickRoll';

const App: React.FC = () => {
    // Use a single state to track the current screen
    const [screen, setScreen] = useState<Screen>('prompt');
    // State to delay enabling hover effects on the "No" button
    const [hoverEnabled, setHoverEnabled] = useState(false);

    const noBtnRef = useRef<HTMLButtonElement>(null);
    const originalRectRef = useRef<DOMRect | null>(null);

    // Use refs for audio instances so they’re created only once
    const congratsAudio = useRef(new Audio('/projects/ihaveaquestion/congratulations.mp3'));
    const boomAudio = useRef(new Audio('/projects/ihaveaquestion/vine_boom.mp3'));
    const clickAudio = useRef(new Audio('/projects/ihaveaquestion/click.mp3'));

    // When entering the Valentine screen, record the No button's original position
    // and delay the hover effect to avoid accidental triggers.
    useEffect(() => {
        if (screen === 'valentine' && noBtnRef.current) {
            originalRectRef.current = noBtnRef.current.getBoundingClientRect();
            setHoverEnabled(false);
            const timer = setTimeout(() => setHoverEnabled(true), 10);
            return () => clearTimeout(timer);
        }
    }, [screen]);

    // When screen changes to rickRoll, play the click sound and redirect.
    useEffect(() => {
        if (screen === 'rickRoll') {
            clickAudio.current.play().catch(console.error);
            window.location.href =
                'https://youtu.be/dQw4w9WgXcQ?si=M4MMSXfuz0lIR59J';
        }
    }, [screen]);

    // Helper function to play the click sound.
    const playClick = useCallback(() => {
        clickAudio.current.play().catch(console.error);
    }, []);

    const handleSureClick = useCallback(() => {
        playClick();
        setScreen('valentine');
    }, [playClick]);

    const handleYesClick = useCallback(() => {
        playClick();
        congratsAudio.current.play().catch(console.error);
        setScreen('final');
    }, [playClick]);

    const handleNoClick = useCallback(() => {
        playClick();
        setScreen('rickRoll');
    }, [playClick]);

    const handleNoBtnMouseOver = useCallback(() => {
        if (!hoverEnabled) return;

        // Reset and play the boom sound
        boomAudio.current.pause();
        boomAudio.current.currentTime = 0;
        boomAudio.current.play().catch(console.error);

        if (noBtnRef.current && originalRectRef.current) {
            const btnWidth = noBtnRef.current.offsetWidth;
            const btnHeight = noBtnRef.current.offsetHeight;
            const marginTop = -100;
            const marginBottom = 150;
            const allowedTopMin = marginTop;
            const allowedTopMax = window.innerHeight - btnHeight - marginBottom;
            const randomLeft = Math.floor(Math.random() * (window.innerWidth - btnWidth));
            const randomTop = Math.floor(
                Math.random() * (allowedTopMax - allowedTopMin + 1)
            ) + allowedTopMin;

            const {left: originalLeft, top: originalTop} = originalRectRef.current;
            const translateX = randomLeft - originalLeft;
            const translateY = randomTop - originalTop;

            noBtnRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    }, [hoverEnabled]);

    // Render based on the current screen.
    if (screen === 'prompt') {
        return (
            <div className="app">
                <div className="screenContainer">
                    <h1>Can I ask you a question?</h1>
                    <button className="btn" onClick={handleSureClick}>
                        Sure
                    </button>
                </div>
            </div>
        );
    } else if (screen === 'valentine') {
        return (
            <div className="app">
                <div id="initialScreen" className="screenContainer">
                    <img id="valentineCat" src="/projects/ihaveaquestion/cat_cute.jpg" alt="Kitten with Rose"/>
                    <h1>Will you be my Valentine?</h1>
                    <div className="yesWrapper">
                        <button id="yesBtn" className="btn" onClick={handleYesClick}>
                            &#x2764; Yes
                        </button>
                        <button
                            id="noBtn"
                            className="btn"
                            ref={noBtnRef}
                            onMouseOver={handleNoBtnMouseOver}
                            onClick={handleNoClick}
                        >
                            &#x1F494; No
                        </button>
                    </div>
                </div>
            </div>
        );
    } else if (screen === 'final') {
        return (
            <div className="app">
                <div id="finalScreen" className="screenContainer">
                    <img src="/projects/ihaveaquestion/cats_hugging.gif" alt="Hugging Cats"/>
                    <h2>Thought you would say no &lt;3</h2>
                </div>
            </div>
        );
    }

    // For the rickRoll screen, the useEffect handles redirection.
    return null;
};

export default App;
