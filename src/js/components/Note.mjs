'use strict';
export class Note {

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number}no - note index,0 is left side
     * @param {number}falltime - 落ちるまでの猶予時間
     * @param {number}hispeed
     * @param {number}NOTE_WIDTH
     * @param {number}FIRST_BPM - BPM
     * */
    constructor(ctx, no, falltime, hispeed, NOTE_WIDTH, FIRST_BPM) {

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

    begin(starttime) {
        this.START_TIME = starttime;
    }

    getSTART_TIME() {
        return this.START_TIME;
    }

    /** このnoteを描画する。
     * @param {DOMHighResTimeStamp|Date} clock
     */
    draw(now) {

        //ノーツの色の設定
        this.ctx.fillStyle = '#DD7070';

        this.y = ((this.falltime + this.beforeTime + ((now - this.START_TIME) * this.scrollspeedforbpm)) / this.hispeed) + 500;
        //ノーツの描画
        this.ctx.fillRect(this.no * this.NOTE_WIDTH, this.y, this.NOTE_WIDTH, 10);
    }

    /**
     * @param {DOMHighResTimeStamp|Date} clock
     * @returns {boolean}
     */
    isOVER(now) {
        if (501 < this.falltime + (now - this.START_TIME)) {
            return true;
        }
        return false;
    }
}
