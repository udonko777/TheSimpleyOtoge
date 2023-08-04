import { TomoyoRender } from 'TomoyoRender';
import { GraphicComponent } from './Component';

export class Note implements GraphicComponent {

    render: TomoyoRender;

    no: number;
    hiSpeed: number;
    NOTE_WIDTH: number;
    fallTime: number;
    scrollSpeedForBPM: number;
    START_TIME: any;

    /**
     * @param render
     * @param no - note index,0 is left side
     * @param fallTime - 落ちるまでの猶予時間
     * @param hiSpeed
     * @param NOTE_WIDTH
     * @param FIRST_BPM - BPM
     * */
    constructor(render: TomoyoRender, no: number, fallTime: number, hiSpeed: number, NOTE_WIDTH: number, FIRST_BPM: number) {

        this.render = render;

        this.no = no;
        this.hiSpeed = hiSpeed;
        this.NOTE_WIDTH = NOTE_WIDTH;
        this.fallTime = fallTime;

        //scrollSpeed 1 : 120 bpm
        this.scrollSpeedForBPM = FIRST_BPM / 120;

        //(落ちるまでの時間 + 現在の時間 - 開始時間) / ハイスピ + 判定位置
        //このタイミングで現在の時間と開始時間が等しいので0

    }

    begin(starttime: number) {
        this.START_TIME = starttime;
    }

    getSTART_TIME(): number {
        return this.START_TIME;
    }

    private getElapsedTime(now: DOMHighResTimeStamp) {
        return now - this.START_TIME;
    }

    draw(now: DOMHighResTimeStamp) {

        const elapsedTime = this.getElapsedTime(now);

        const x = this.no * this.NOTE_WIDTH;
        const y = (((elapsedTime * this.scrollSpeedForBPM) - this.fallTime) / this.hiSpeed) + 500;

        this.render.drawBox(x, y, this.NOTE_WIDTH, 10, '#DD7070');
    }

    isOVER(now: DOMHighResTimeStamp): boolean {
        if (501 < (this.getElapsedTime(now) - this.fallTime)) {
            return true;
        }
        return false;
    }
}
