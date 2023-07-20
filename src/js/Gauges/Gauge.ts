'use strict';

import { TomoyoRender, Color } from "TomoyoRender";

export abstract class Gauge {

    render: TomoyoRender;

    groove: number;
    MAXGROOVE: number;
    STATEX: number;
    STATEY: number;
    GAUGE_HEIGHT: number;
    GAUGE_WIDTH: number;
    GAUGE_VOID_WIDTH: number;
    GAUGE_BOX_NUMBER: number;
    PGREAT: number;
    GREAT: number;
    GOOD: number;
    BAD: number;
    POOR: number;
    OVER: number;
    BREAK: number;
    IS_TOLERANT: boolean;

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

        const existarea = (this.GAUGE_WIDTH - this.GAUGE_VOID_WIDTH) / this.GAUGE_BOX_NUMBER;
        const voidarea = this.GAUGE_VOID_WIDTH / this.GAUGE_BOX_NUMBER;
        let usedarea = 0;

        for (let i = 0; i < this.GAUGE_BOX_NUMBER; i++) {
            this.writebox(this.boxcolor(i), usedarea + this.STATEX, this.STATEY, existarea, this.GAUGE_HEIGHT);
            usedarea = usedarea + existarea + voidarea;
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
    protected writebox(color: string | CanvasGradient | CanvasPattern, x: number, y: number, boxwidth: number, boxheight: number) {
        //ノーツの色の設定
        this.render.drawBox(x,y,boxwidth,boxheight,String(color));
    }

    /** FIX せっかく実装を強制している割には外からアクセスできないのは悲しい。*/
    protected abstract boxcolor(no: number): Color

}
