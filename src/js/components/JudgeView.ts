import { TomoyoRender } from 'TomoyoRender';
import { GraphicComponent } from './Component'

export class JudgeView implements GraphicComponent {

    readonly render: TomoyoRender;
    judgeName: string;
    x: number;
    y: number;

    /** Judgeを実際に表示させるUI。実際にはcomboViewと組み合わせてつかうゾ
     */
    constructor(render: TomoyoRender) {
        //judge == {N/A,poor,poor,good,great,great}
        this.render = render;
        this.judgeName = "N/A";
        this.x = 70;
        this.y = 370;
    }

    set judge(judgeName: string) {
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
                console.warn("i dont know this judgeName");
                break;
        }
    }

    draw() {
        switch (this.judgeName) {
            case "N/A":
                break;
            case "OVER":
                this.render.drawText("POOR", this.x, this.y, "48px serif", 'rgb( 255, 102, 102)');
                break;
            case "POOR":
                this.render.drawText("POOR", this.x, this.y, "48px serif", 'rgb( 255, 102, 102)');
                break;
            case "BAD":
                this.render.drawText("BAD", this.x, this.y, "48px serif", 'rgb( 255, 102, 102)');
                break;
            case "GOOD":
                this.render.drawText("GOOD", this.x, this.y, "48px serif", 'rgb( 255, 102, 102)');
                break;
            case "GREAT":
                this.render.drawText("GREAT", this.x, this.y, "48px serif", 'rgb( 255, 102, 102)');
                break;
        }
    }
}
