import { TomoyoRender } from "TomoyoRender";
import { GraphicComponent } from "./Component";

export class Bomb implements GraphicComponent{

    render: TomoyoRender;
    no: number;
    bombLife: number;
    NOTE_WIDTH: number;

    /**
     * @param ctx
     * @param no - Left to right, 0 to 4
     * @param bombLife
     * @param NOTE_WIDTH
     */
    constructor(render: TomoyoRender, no: number, bombLife: number, NOTE_WIDTH: number) {
        this.render = render;
        this.no = no;
        this.bombLife = bombLife;
        this.NOTE_WIDTH = NOTE_WIDTH;
    }

    draw() {

        if (this.bombLife > 0) {

            const x = this.no * this.NOTE_WIDTH
            const y = 480 + (this.bombLife / 4)

            this.render.drawBox(x, y, this.NOTE_WIDTH, 5, `rgba( 100, 105, 200, ${this.bombLife / 50})`);
            this.bombLife -= 1;
        }

    }

    setBombLife(bombLife: number) {
        this.bombLife = bombLife;
    }

}
