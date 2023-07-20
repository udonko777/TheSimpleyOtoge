export class Bomb {

    ctx: CanvasRenderingContext2D;
    no: number;
    bomblife: number;
    NOTE_WIDTH: number;

    /**
     * @param ctx
     * @param no - Left to right, 0 to 4
     * @param bomblife
     * @param NOTE_WIDTH
     */
    constructor(ctx: CanvasRenderingContext2D, no: number, bomblife: number, NOTE_WIDTH: number) {
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
    setbomblife(bomblife:number) {
        this.bomblife = bomblife;
    }
}
