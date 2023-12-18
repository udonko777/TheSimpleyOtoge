
/**
 * 音楽を流す。
 */
export class MusicPlayer {

    readonly audioContext: AudioContext;
    readonly audioElement: HTMLAudioElement;
    readonly music: MediaElementAudioSourceNode;

    constructor() {
        const AudioContext = window.AudioContext;

        this.audioContext = new AudioContext();

        this.audioElement = document.querySelector('audio')!;
        this.music = this.audioContext.createMediaElementSource(this.audioElement);

        this.music.connect(this.audioContext.destination);
    }

    play() {
        if (this.audioContext.state === 'suspended') {
            void this.audioContext.resume();
        } else {
            void this.audioElement.play();
        }
    }

}
