'use strict';
import { TomoyoRender } from "TomoyoRender";
import { Gauge } from "./Gauge";

export class GrooveGauge extends Gauge {

    private readonly GAUGE_BOX_AS_GROOVE: number;

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

}
