'use strict';
import { TomoyoRender } from "TomoyoRender";
import { Gauge } from "./Gauge";

export class GrooveGauge extends Gauge {

    GAUGE_BOX_AS_GROOVE: number;

    /** ゲージのUIの実装とゲージの計算 */
    constructor(render: TomoyoRender) {
        super(render);

        this.groove = 22220;
        this.GAUGE_BOX_NUMBER = 24;

        this.GAUGE_BOX_AS_GROOVE = this.MAXGROOVE / this.GAUGE_BOX_NUMBER;

        this.GREAT = 1000;
        this.GOOD = 100;
        this.BAD = -1200;
        this.OVER = -2000;
    }

    override boxcolor(no: number) {
        const enableBoxNumber = Math.floor(this.groove / this.GAUGE_BOX_AS_GROOVE);

        if (no < enableBoxNumber) {
            return '#3ad132';
        } else {
            return '#444444';
        }
    }

    /** ジャッジの名前からゲージの増減を計算する。ジャッジをオブジェクトにすればこんなことしなくていいと思う。
     * @param judgeName
     */
    set judge(judgeName: string) {
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
