import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import AudioPlayer from '../components/AudioPlayer';
import { audioFiles } from "../assets/data/audioNames";
import { AudiosCDN, formatInput, randomIntBetween, downloadFile, AUDIO_EXTENSION } from '../utils';
import { setPreferences, getPreferences, Preferences } from '../assets/data/Preferences';


const Home = () => {

    const audioBuffer = useRef<HTMLAudioElement | null>(null);
    const [audioTimeStamp, setAudioTimeStamp] = useState<number>(0);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
    const [playLoop, setPlayLoop] = useState(true);
    const [autoPlay, setAutoPlay] = useState<boolean>(true);
    const [keyWords, setKeyWords] = useState("");
    const [paused, setPaused] = useState(true);
    const [autoScroll, setAutoScroll] = useState<boolean>(true);
    const [blendedPlay, setBlendedPlay] = useState<boolean>(false);
    const [displayedAudios, setDisplayedAudios] = useState<string[]>([]);

    const [preferences, setPreferencesState] = useState<Preferences | null>(null);

    async function loadPreferences() {
        const storedPreferences = await getPreferences();
        if (storedPreferences) {
            setPreferencesState(storedPreferences);
            setAutoPlay(storedPreferences.autoPlay);
            setAutoScroll(storedPreferences.autoScroll);
            setBlendedPlay(storedPreferences.blendedPlay);
        }
    }

    function storePreferences() {
        if (preferences) {
            const updatedPreferences: Preferences = { ...preferences, autoPlay, autoScroll, blendedPlay };
            setPreferencesState(updatedPreferences);
            setPreferences(updatedPreferences);
        }
    }

    const bindKeys = () => {
        document.addEventListener("keydown", (e) => {
            let keyCode: string = e.code;
            e.preventDefault();
            if (keyCode === "Space") {

                console.log('space');
                handlePause();
            } else if (keyCode === "ArrowRight") {
                console.log('la');

                playNext();
            } else if (keyCode === "ArrowLeft") {
                playPrevious();
            }
        })
    }

    const loadAudio = (index: number) => {
        if (index) {
            audioBuffer.current && (audioBuffer.current.src = AudiosCDN + displayedAudios[index] + AUDIO_EXTENSION);
        }
    }

    const playAudio = (index: number) => {

        setPaused(false);
        audioBuffer.current && (audioBuffer.current.src = AudiosCDN + displayedAudios[index] + AUDIO_EXTENSION);
        audioBuffer.current?.play();
        setCurrentAudioIndex(index);
        scrollIntoView(index);
    }

    const playNext = () => {
        let newIndex;
        !blendedPlay ? newIndex = currentAudioIndex + 1 : newIndex = randomIntBetween(0, displayedAudios.length - 1);

        if (newIndex < displayedAudios.length) {
            playAudio(newIndex);
        } else {
            if (playLoop) {
                newIndex = 0;
                playAudio(newIndex);
            }
        }
    }

    const playPrevious = () => {
        let newIndex;
        !blendedPlay ? newIndex = currentAudioIndex - 1 : newIndex = randomIntBetween(0, displayedAudios.length - 1);

        if (newIndex >= 0) {
            playAudio(newIndex);
        } else {
            setCurrentAudioIndex(0);
        }
    }

    const handlePause = () => {
        setPaused(!paused);
        let theAudio = audioBuffer.current;
        audioBuffer.current && paused ? theAudio?.play() : theAudio?.pause();
    }

    const audioEnded = () => {
        setPaused(true);
        if (autoPlay) {
            playNext();
        }
    }

    const copyCurrentAudioLink = () => {
        audioBuffer.current && navigator.clipboard.writeText(audioBuffer.current.src)
    }

    useEffect(() => {
        setDisplayedAudios(prevAudios => {
            const newAudios = audioFiles.filter((audioName) => formatInput(audioName).includes(keyWords));
            setCurrentAudioIndex(0);
            loadAudio(0);
            return newAudios;
        });
    }, [keyWords]);

    useEffect(() => {
        if (autoScroll) { scrollIntoView(currentAudioIndex) }
    }, [autoScroll])

    useEffect(() => {
        loadPreferences();
        //bindKeys();
    }, [])

    useEffect(() => {
        storePreferences();
    }, [autoPlay, blendedPlay, autoScroll])

    const scrollIntoView = (index: number) => {
        if (autoScroll) {
            const audioPlayerElement = document.getElementById(`audio-player-${index}`);
            audioPlayerElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <div id="home">
            <audio ref={audioBuffer} controls onEnded={audioEnded} onTimeUpdate={() => { if (audioBuffer.current) { setAudioTimeStamp(audioBuffer.current?.currentTime) } }} />
            <SearchBar masterSetKeyWords={setKeyWords} />

            <div className="main-container">
                <div className="tool-bar">
                    <button className="interactable" onClick={() => { setAutoScroll(!autoScroll); }}>
                        <i className={`fa-solid fa-${autoScroll ? 'eye' : 'eye-slash'}`}></i>
                    </button>

                    <button className="interactable" onClick={() => { if (audioBuffer.current?.src) downloadFile(audioBuffer.current.src) }}>
                        <i className="fa-solid fa-download"></i>
                    </button>

                </div>
                <div className="audios-container">
                    {displayedAudios.map((audioName: string, index: number) => (
                        <AudioPlayer key={index} index={index} audioName={audioName} masterPlayAudio={playAudio} currentAudioIndex={currentAudioIndex} currentAudio={audioBuffer.current} audioTimeStamp={audioTimeStamp} />
                    ))}
                </div>

                <div className="player-controls">
                    <div className="top">
                        <button className="interactable" onClick={copyCurrentAudioLink}>
                            <i className="fa-solid fa-share"></i>
                        </button>
                        <button className="interactable">
                            <i className="fa-regular fa-heart"></i>
                        </button>
                        <button className="interactable">
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>

                    <div className="bottom">
                        <button className="interactable" onClick={() => setBlendedPlay(!blendedPlay)}>
                            <i className={`fa-solid fa-${blendedPlay ? 'shuffle' : 'arrow-right-long'}`}></i>
                        </button>

                        <div className="center">
                            <button className="interactable" onClick={playPrevious}>
                                <i className="fa-solid fa-backward-fast"></i>
                            </button>
                            <button className="interactable pause" onClick={handlePause}>
                                <i className={`fa-solid fa-${paused ? "play" : "pause"}`}></i>

                            </button>
                            <button className="interactable" onClick={playNext}>
                                <i className="fa-solid fa-forward-fast"></i>
                            </button>
                        </div>

                        <button className="interactable" onClick={() => { setAutoPlay(!autoPlay); }}>
                            <i className={`fa-solid fa-${autoPlay ? 'repeat' : 'angles-down'}`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Home;