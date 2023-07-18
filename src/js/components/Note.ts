import {GraphicComponent} from './Component';

export class Note implements GraphicComponent {

    ctx: CanvasRenderingContext2D;
    no: number;
    hispeed: number;
    NOTE_WIDTH: number;
    falltime: number;
    beforeTime: number;
    scrollspeedforbpm: number;
    y: number;
    START_TIME: any;

    /**
     * @param ctx
     * @param no - note index,0 is left side
     * @param falltime - 落ちるまでの猶予時間
     * @param hispeed
     * @param NOTE_WIDTH
     * @param FIRST_BPM - BPM
     * */
    constructor(ctx: CanvasRenderingContext2D, no: number, falltime: number, hispeed: number, NOTE_WIDTH: number, FIRST_BPM: number) {

        this.ctx = ctx;
        this.no = no;
        this.hispeed = hispeed;
        this.NOTE_WIDTH = NOTE_WIDTH;
        this.falltime = 0 - falltime;
        this.beforeTime = 0;
        
        //scrollspeed 1 : 120 bpm
        this.scrollspeedforbpm = FIRST_BPM / 120;

        //(落ちるまでの時間 + 現在の時間 - 開始時間) / ハイスピ + 判定位置
        //このタイミングで現在の時間と開始時間が等しいので0
        this.y = ((this.falltime + 0) / this.hispeed) + 500;
    }

    begin(starttime : number) {
        this.START_TIME = starttime;
    }

    getSTART_TIME() : number {
        return this.START_TIME;
    }

    draw(now:DOMHighResTimeStamp) {

        this.ctx.fillStyle = '#DD7070';

        this.y = ((this.falltime + this.beforeTime + ((now - this.START_TIME) * this.scrollspeedforbpm)) / this.hispeed) + 500;
        //ノーツの描画
        this.ctx.fillRect(this.no * this.NOTE_WIDTH, this.y, this.NOTE_WIDTH, 10);
    }

    isOVER(now : DOMHighResTimeStamp): boolean {
        if (501 < this.falltime + (now - this.START_TIME)) {
            return true;
        }
        return false;
    }
}