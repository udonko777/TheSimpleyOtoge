import {GraphicComponent} from './Component'

export class JudgeView implements GraphicComponent {

    readonly ctx: CanvasRenderingContext2D;
    judgeName: string;
    x: number;
    y: number;

    /** Judgeを実際に表示させるUI。実際にはcomboViewと組み合わせてつかうゾ
     * @param ctx
     */
    constructor(ctx:CanvasRenderingContext2D) {
        //judge == {N/A,poor,poor,good,great,great}
        this.ctx = ctx;
        this.judgeName = "N/A";
        this.x = 70;
        this.y = 370;
    }

    set judge(judgeName : string) {
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
                this.ctx.fillStyle = 'rgb( 255, 102, 102)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("POOR", this.x, this.y);
                break;
            case "POOR":
                this.ctx.fillStyle = 'rgb( 255, 102, 102)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("POOR", this.x, this.y);
                break;
            case "BAD":
                this.ctx.fillStyle = 'rgb( 255, 102, 102)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("BAD", this.x, this.y);
                break;
            case "GOOD":
                this.ctx.fillStyle = 'rgb( 255, 128, 0)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("GOOD", this.x, this.y);
                break;
            case "GREAT":
                this.ctx.fillStyle = 'rgb( 0, 128, 255)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("GREAT", this.x, this.y);
                break;
        }
    }
}
