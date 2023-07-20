import { TomoyoRender } from "TomoyoRender";

export class Bomb {

    render: TomoyoRender;
    no: number;
    bomblife: number;
    NOTE_WIDTH: number;

    /**
     * @param ctx
     * @param no - Left to right, 0 to 4
     * @param bomblife
     * @param NOTE_WIDTH
     */
    constructor(render: TomoyoRender, no: number, bomblife: number, NOTE_WIDTH: number) {
        this.render = render;
        this.no = no;
        this.bomblife = bomblife;
        this.NOTE_WIDTH = NOTE_WIDTH;
    }

    writebomb() {

        if (this.bomblife > 0) {

            const x = this.no * this.NOTE_WIDTH
            const y = 480 + (this.bomblife / 4)

            this.render.drawBox(x, y, this.NOTE_WIDTH, 5, `rgba( 100, 105, 200,${this.bomblife / 50})`);
            this.bomblife -= 1;
        }

        return;
    }

    /**
     * これただのセッターじゃねーか！！！！！！なんなんだ
     * @param {number} bomblife
     */
    setbomblife(bomblife: number) {
        this.bomblife = bomblife;
    }
}
