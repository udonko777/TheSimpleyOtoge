'use strict';

export class Bomb {

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} no - Left to right, 0 to 4
     * @param {number} bomblife
     * @param {number} NOTE_WIDTH
     */
    constructor(ctx, no, bomblife, NOTE_WIDTH) {
        this.ctx = ctx;
        this.no = no;
        this.bomblife = bomblife;
        this.NOTE_WIDTH = NOTE_WIDTH;
    }

    writebomb() {

        if (this.bomblife > 0) {
            this.ctx.fillStyle = `rgba( 100, 105, 200,${this.bomblife / 50})`;
            this.ctx.fillRect(this.no * this.NOTE_WIDTH, 480 + (this.bomblife / 4), this.NOTE_WIDTH, 5);
            this.bomblife -= 1;
        }

        return;
    }

    /**
     * これただのセッターじゃねーか！！！！！！なんなんだ
     * @param {number} bomblife
     */
    setbomblife(bomblife) {
        this.bomblife = bomblife;
    }
}
