import { makeText } from '../TomoyoRender';
import { GraphicComponent } from './Component'

export class JudgeView implements GraphicComponent {

    private judgeName: string;
    private x: number;
    private y: number;

    /** 
     * Judgeを実際に表示させるUI。実際にはcomboViewと組み合わせてつかう
     */
    constructor() {
        this.judgeName = "N/A";
        this.x = 70;
        this.y = 370;
    }

    public setJudge(judgeName: string) {
        switch (judgeName) {
            case "OVER":
                this.judgeName = "OVER";
                break;
            case "POOR":
                this.judgeName = "POOR";
                break;
            case "BAD":
                this.judgeName = "BAD";
                break;
            case "GOOD":
                this.judgeName = "GOOD";
                break;
            case "GREAT":
                this.judgeName = "GREAT";
                break;
            default:
                console.warn("i don't know this judgeName");
                break;
        }
    }

    public draw() {
        switch (this.judgeName) {
            case "N/A":
                break;
            case "OVER":
                return makeText("POOR", this.x, this.y, "48px serif", 'rgb( 255, 102, 102)');
            case "POOR":
                return makeText("POOR", this.x, this.y, "48px serif", 'rgb( 255, 102, 102)');
            case "BAD":
                return makeText("BAD", this.x, this.y, "48px serif", 'rgb( 255, 102, 102)');
            case "GOOD":
                return makeText("GOOD", this.x, this.y, "48px serif", 'rgb( 255, 102, 102)');
            case "GREAT":
                return makeText("GREAT", this.x, this.y, "48px serif", 'rgb( 255, 102, 102)');
        }
    }
}
