import { Box, makeBox } from "../TomoyoRender";
import { GraphicComponent } from "./Component";

export class Bomb implements GraphicComponent {

    private readonly no: number;
    private bombLife: number;
    private readonly NOTE_WIDTH: number;

    /**
     * @param render 
     * @param no Left to right, 0 to 4
     * @param bombLife
     * @param NOTE_WIDTH
     */
    constructor(no: number, bombLife: number, NOTE_WIDTH: number) {
        this.no = no;
        this.bombLife = bombLife;
        this.NOTE_WIDTH = NOTE_WIDTH;
    }

    public draw() {

        if (this.bombLife > 0) {

            const x = this.no * this.NOTE_WIDTH
            const y = 480 + (this.bombLife / 4)

            const bombGraphic: Box = makeBox(x, y, this.NOTE_WIDTH, 5, `rgba( 100, 105, 200, ${this.bombLife / 50})`);

            this.bombLife -= 1;
            return bombGraphic;
        }

    }

    public setBombLife(bombLife: number): void {
        this.bombLife = bombLife;
    }

}
