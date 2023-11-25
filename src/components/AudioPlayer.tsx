import React, { useRef, useState } from 'react';
import { AudiosCDN } from '../utils';
//import aud from "../assets/img/fdffd.png";
//import aud from "";

const AudioPlayer: React.FC<{ index: number, audioName: string, masterPlayAudio: (index: number) => void, currentAudioIndex: number }> = ({ index, audioName, masterPlayAudio, currentAudioIndex }) => {

    const uniqueId = `audio-player-${index}`;

    const [formatedDuration, setFormatedDuration] = useState("0:00");

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        setFormatedDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }

    return (
        <div id="audio-player" className={`${currentAudioIndex === index ? 'playing' : ''}`}>
            <div id={uniqueId}></div>
            {/* <audio controls onCanPlayThrough={(e) => { formatDuration(e.currentTarget.duration) }}>
                <source src="test.ogg" type=" audio/ogg" />
            </audio> */}
            <audio src={AudiosCDN + audioName} controls onCanPlayThrough={(e) => { formatDuration(e.currentTarget.duration) }}></audio>
            {/* <audio controls src={AudiosCDN + audioName} /> */}
            <div className="player" onClick={() => masterPlayAudio(index)}>
                <span className='scroll-title'><p className="title">{audioName}</p></span>
                <p className="duration">{formatedDuration}</p>
            </div>
        </div >
    );
};

export default AudioPlayer;