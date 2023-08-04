'use strict';
/**
 * ただ音楽を流すだけのClass。
 */
export class MusicPlayer {

    audioContext: AudioContext;
    audioElement: HTMLAudioElement;
    music: MediaElementAudioSourceNode;

    constructor() {
        const AudioContext = window.AudioContext;

        this.audioContext = new AudioContext();

        this.audioElement = document.querySelector('audio')!;
        this.music = this.audioContext.createMediaElementSource(this.audioElement);

        this.music.connect(this.audioContext.destination);
    }

    play() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        } else {
            this.audioElement.play();
        }
    }

}
