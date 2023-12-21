import { Color, makeBox, renderableObject } from "../TomoyoRender";

export class Gauge {

    private readonly GAUGE_BOX_AS_GROOVE: number;

    private groove: number;
    private readonly MAX_GROOVE: number;
    private readonly STATE_X: number;
    private readonly STATE_Y: number;
    private readonly GAUGE_HEIGHT: number;
    private readonly GAUGE_WIDTH: number;
    private readonly GAUGE_VOID_WIDTH: number;
    private readonly GAUGE_BOX_NUMBER: number;
    private readonly P_GREAT: number;
    private readonly GREAT: number;
    private readonly GOOD: number;
    private readonly BAD: number;
    private readonly POOR: number;
    private readonly OVER: number;
    private readonly BREAK: number;
    private readonly IS_TOLERANT: boolean;

    constructor() {

        //0 <= groove <= 65536
        this.MAX_GROOVE = 65536;
        this.GAUGE_BOX_NUMBER = 24;

        this.GAUGE_BOX_AS_GROOVE = this.MAX_GROOVE / this.GAUGE_BOX_NUMBER;

        this.STATE_X = 0;
        this.STATE_Y = 0;

        this.GAUGE_HEIGHT = 30;
        this.GAUGE_WIDTH = 320;

        this.GAUGE_VOID_WIDTH = 20;

        //ゲージの計算関連
        this.P_GREAT = 0;
        this.POOR = 0;
        this.BREAK = 0;
        //this.judge = ;
        //grooveが0の時ゲームを終了させるか
        this.IS_TOLERANT = false;

        this.groove = 22220;

        this.GREAT = 1000;
        this.GOOD = 100;
        this.BAD = -1200;
        this.OVER = -2000;
    }

    public draw(): renderableObject[] {

        const VISIBLE_AREA = (this.GAUGE_WIDTH - this.GAUGE_VOID_WIDTH) / this.GAUGE_BOX_NUMBER;
        const INVISIBLE_AREA = this.GAUGE_VOID_WIDTH / this.GAUGE_BOX_NUMBER;
        let usedArea = 0;

        const boxes: renderableObject[] = []

        for (let i = 0; i < this.GAUGE_BOX_NUMBER; i++) {
            const box = this.writeBox(this.boxColor(i), usedArea + this.STATE_X, this.STATE_Y, VISIBLE_AREA, this.GAUGE_HEIGHT);
            boxes.push(box);

            usedArea = usedArea + VISIBLE_AREA + INVISIBLE_AREA;
        }

        return boxes;

    }

    /**
     * @private
     * @param color
     * @param x
     * @param y
     * @param boxwidth
     * @param boxheight
     */
    protected writeBox(color: Color, x: number, y: number, boxwidth: number, boxheight: number) {
        //ノーツの色の設定
        return makeBox(x, y, boxwidth, boxheight, color);
    }

    public setJudge(judgeName: string): void {
        switch (judgeName) {
            case "PGREAT":
                this.groove += this.P_GREAT;
                break;
            case "GREAT":
                this.groove += this.GREAT;
                break;
            case "GOOD":
                this.groove += this.GOOD;
                break;
            case "BAD":
                this.groove += this.BAD;
                break;
            case "POOR":
                this.groove += this.POOR;
                break;
            case "OVER":
                this.groove += this.OVER;
                break;
            case "BREAK":
                this.groove += this.BREAK;
                break;

            default:
                console.log("i d'ont know this judgeName");
                break;
        }

        //this.grooveを0 ~ MAX_GROOVEに成型する
        this.groove = Math.max(this.groove, 0);

        this.groove = Math.min(this.groove, this.MAX_GROOVE);
    }

    private boxColor(no: number): Color {
        const enableBoxNumber = Math.floor(this.groove / this.GAUGE_BOX_AS_GROOVE);

        if (no < enableBoxNumber) {
            return '#3ad132';
        } else {
            return '#444444';
        }
    }

}
