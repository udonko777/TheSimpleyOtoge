import { TomoyoRender } from 'TomoyoRender';
import { GraphicComponent } from './Component';

export class Note implements GraphicComponent {

    render: TomoyoRender;

    no: number;
    hiSpeed: number;
    NOTE_WIDTH: number;
    fallTime: number;
    beforeTime: number;
    scrollSpeedForBPM: number;
    y: number;
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
        this.fallTime = 0 - fallTime;
        this.beforeTime = 0;

        //scrollSpeed 1 : 120 bpm
        this.scrollSpeedForBPM = FIRST_BPM / 120;

        //(落ちるまでの時間 + 現在の時間 - 開始時間) / ハイスピ + 判定位置
        //このタイミングで現在の時間と開始時間が等しいので0
        this.y = ((this.fallTime + 0) / this.hiSpeed) + 500;
    }

    begin(starttime: number) {
        this.START_TIME = starttime;
    }

    getSTART_TIME(): number {
        return this.START_TIME;
    }

    draw(now: DOMHighResTimeStamp) {

        this.y = ((this.fallTime + this.beforeTime + ((now - this.START_TIME) * this.scrollSpeedForBPM)) / this.hiSpeed) + 500;

        const x = this.no * this.NOTE_WIDTH;
        this.render.drawBox(x, this.y, this.NOTE_WIDTH, 10, '#DD7070');
    }

    isOVER(now: DOMHighResTimeStamp): boolean {
        if (501 < this.fallTime + (now - this.START_TIME)) {
            return true;
        }
        return false;
    }
}
