'use strict';
import { Gauge } from "./Gauge.mjs";

export class GrooveGauge extends Gauge {

    /** ゲージのUIの実装とゲージの計算
     * @param {CanvasRenderingContext2D} ctx
     */
    constructor(ctx) {
        super(ctx);

        this.groove = 22220;
        this.GAUGE_BOX_NUMBER = 24;

        this.GAUGE_BOX_AS_GROOVE = this.MAXGROOVE / this.GAUGE_BOX_NUMBER;

        this.GREAT = 1000;
        this.GOOD = 100;
        this.BAD = -1200;
        this.OVER = -2000;
    }

    boxcolor(no) {
        const enableBoxNumber = Math.floor(this.groove / this.GAUGE_BOX_AS_GROOVE);

        if (no < enableBoxNumber) {
            return '#3ad132';
        } else {
            return '#444444';
        }
    }

    /** ジャッジの名前からゲージの増減を計算する。ジャッジをオブジェクトにすればこんなことしなくていいと思う。
     * @param {string} judgeName
     */
    set judge(judgeName) {
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
                console.log("i dont know this judgeName");
                break;
        }

        //this.grooveを0 ~ MAXGROOVEに成型する
        this.groove = Math.max(this.groove, 0);

        this.groove = Math.min(this.groove, this.MAXGROOVE);
    }
}
