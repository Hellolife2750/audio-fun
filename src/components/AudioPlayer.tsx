import React, { useRef, useState } from 'react';
import { AudiosCDN, AUDIO_EXTENSION } from '../utils';
//import aud from "../assets/img/fdffd.png";
//import aud from "";

const AudioPlayer: React.FC<{ index: number, audioName: string, masterPlayAudio: (index: number) => void, currentAudioIndex: number, currentAudio: HTMLAudioElement | null, audioTimeStamp: number }> = ({ index, audioName, masterPlayAudio, currentAudioIndex, currentAudio, audioTimeStamp }) => {

    const progressBar = useRef<HTMLDivElement | null>(null);

    const uniqueId = `audio-player-${index}`;

    const [formatedDuration, setFormatedDuration] = useState("0:00");

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        setFormatedDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }

    const isCurrentAudio = (): boolean => {
        return currentAudioIndex === index;
    }

    const audioLength = currentAudio?.duration;
    //const actualTimestamp = currentAudio?.currentTime;

    if (isCurrentAudio()) {
        if (audioLength && audioTimeStamp) {
            progressBar.current?.style.setProperty("--progress", `${(100 * audioTimeStamp) / audioLength}%`);
            //console.log((100 * audioTimeStamp) / audioLength);
        }
    } else {
        progressBar.current?.style.setProperty("--progress", `0%`);
    }

    return (
        <div id="audio-player" className={`${isCurrentAudio() ? 'playing' : ''}`}>
            <div id={uniqueId}></div>
            {/* <audio controls onCanPlayThrough={(e) => { formatDuration(e.currentTarget.duration) }}>
                <source src="test.ogg" type=" audio/ogg" />
            </audio> */}
            <audio src={AudiosCDN + audioName + AUDIO_EXTENSION} controls onCanPlayThrough={(e) => { formatDuration(e.currentTarget.duration) }}></audio>
            {/* <audio controls src={AudiosCDN + audioName} /> */}
            <div className="player" onClick={() => masterPlayAudio(index)}>
                <span className='scroll-title'><p className="title">{audioName}</p></span>
                <p className="duration">{formatedDuration}</p>
            </div>
            <div ref={progressBar} className="progress"></div>
        </div >
    );
};

export default AudioPlayer;