import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

type Screen = 'prompt' | 'valentine' | 'final' | 'rickRoll';

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('prompt');
    const [hoverEnabled, setHoverEnabled] = useState(false);

    const noBtnRef = useRef<HTMLButtonElement>(null);
    const originalRectRef = useRef<DOMRect | null>(null);

    const congratsAudio = useRef(new Audio('/projects/ihaveaquestion/congratulations.mp3'));
    const boomAudio = useRef(new Audio('/projects/ihaveaquestion/vine_boom.mp3'));
    const clickAudio = useRef(new Audio('/projects/ihaveaquestion/click.mp3'));

    useEffect(() => {
        if (screen === 'valentine' && noBtnRef.current) {
            originalRectRef.current = noBtnRef.current.getBoundingClientRect();
            setHoverEnabled(false);
            const timer = setTimeout(() => setHoverEnabled(true), 10);
            return () => clearTimeout(timer);
        }
    }, [screen]);

    useEffect(() => {
        if (screen === 'rickRoll') {
            clickAudio.current.play().catch(console.error);
            window.location.href = 'https://youtu.be/dQw4w9WgXcQ?si=M4MMSXfuz0lIR59J';
        }
    }, [screen]);

    const playClick = useCallback(() => {
        if (!isMobile) {
            clickAudio.current.play().catch(console.error);
        }
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
        if (isMobile) {
            moveButton();
        } else {
            setScreen('rickRoll');
        }
    }, [playClick]);

    const moveButton = useCallback(() => {
        boomAudio.current.pause();
        boomAudio.current.currentTime = 0;
        boomAudio.current.play().catch(console.error);

        if (noBtnRef.current && originalRectRef.current) {
            const btnWidth = noBtnRef.current.offsetWidth;
            const btnHeight = noBtnRef.current.offsetHeight;
            const marginTop = -80;
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
    }, []);

    const handleNoBtnMouseOver = useCallback(() => {
        if (!hoverEnabled || isMobile) return;
        moveButton();
    }, [hoverEnabled, moveButton]);

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

    return null;
};

export default App;
