import { TomoyoRender, Color } from "TomoyoRender";

export abstract class Gauge {

    protected readonly render: TomoyoRender;

    protected groove: number;
    protected MAXGROOVE: number;
    protected STATEX: number;
    protected STATEY: number;
    protected GAUGE_HEIGHT: number;
    protected GAUGE_WIDTH: number;
    protected GAUGE_VOID_WIDTH: number;
    protected GAUGE_BOX_NUMBER: number;
    protected PGREAT: number;
    protected GREAT: number;
    protected GOOD: number;
    protected BAD: number;
    protected POOR: number;
    protected OVER: number;
    protected BREAK: number;
    protected IS_TOLERANT: boolean;

    constructor(render: TomoyoRender) {

        this.render = render;

        //0 <= groove <= 65536
        this.groove = 0;
        this.MAXGROOVE = 65536;

        this.STATEX = 0;
        this.STATEY = 0;

        this.GAUGE_HEIGHT = 30;
        this.GAUGE_WIDTH = 320;

        this.GAUGE_VOID_WIDTH = 20;
        this.GAUGE_BOX_NUMBER = 20;

        //ゲージの計算関連
        this.PGREAT = 0;
        this.GREAT = 0;
        this.GOOD = 0;
        this.BAD = 0;
        this.POOR = 0;
        this.OVER = 0;
        this.BREAK = 0;
        //this.judge = ;
        //grooveが0の時ゲームを終了させるか
        this.IS_TOLERANT = false;
    }

    public draw() {

        const VISIBLE_AREA = (this.GAUGE_WIDTH - this.GAUGE_VOID_WIDTH) / this.GAUGE_BOX_NUMBER;
        const INVISIBLE_AREA = this.GAUGE_VOID_WIDTH / this.GAUGE_BOX_NUMBER;
        let usedarea = 0;

        for (let i = 0; i < this.GAUGE_BOX_NUMBER; i++) {
            this.writebox(this.boxcolor(i), usedarea + this.STATEX, this.STATEY, VISIBLE_AREA, this.GAUGE_HEIGHT);
            usedarea = usedarea + VISIBLE_AREA + INVISIBLE_AREA;
        }

    }

    /**
     * @private
     * @param color
     * @param x
     * @param y
     * @param boxwidth
     * @param boxheight
     */
    protected writebox(color: Color, x: number, y: number, boxwidth: number, boxheight: number) {
        //ノーツの色の設定
        this.render.drawBox(x, y, boxwidth, boxheight, String(color));
    }

    public setJudge(judgeName : string):void{
        switch (judgeName) {
            case "PGREAT":
                this.groove += this.PGREAT;
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

        //this.grooveを0 ~ MAXGROOVEに成型する
        this.groove = Math.max(this.groove, 0);

        this.groove = Math.min(this.groove, this.MAXGROOVE);
    }

    /** FIX せっかく実装を強制している割には外からアクセスできないのは悲しい。*/
    protected abstract boxcolor(no: number): Color

}
