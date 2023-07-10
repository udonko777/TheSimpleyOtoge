'use strict';
export class Gauge {

    /**
     * @abstract
     * @param {CanvasRenderingContext2D} ctx
     */
    constructor(ctx) {

        this.ctx = ctx;

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

    draw() {

        const existarea = (this.GAUGE_WIDTH - this.GAUGE_VOID_WIDTH) / this.GAUGE_BOX_NUMBER;
        const voidarea = this.GAUGE_VOID_WIDTH / this.GAUGE_BOX_NUMBER;
        let usedarea = 0;

        for (let i = 0; i < this.GAUGE_BOX_NUMBER; i++) {
            this.writebox(this.boxcolor(i), usedarea + this.STATEX, this.STATEY, existarea, this.GAUGE_HEIGHT);
            usedarea = usedarea + existarea + voidarea;
        }

    }

    //外部から呼び出せないようにすべき
    /**
     * @private
     * @param {string | CanvasGradient | CanvasPattern} color
     * @param {number} x
     * @param {number} y
     * @param {number} boxwidth
     * @param {number} boxheight
     */
    writebox(color, x, y, boxwidth, boxheight) {
        //ノーツの色の設定
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, boxwidth, boxheight);
    }

    /**
     * @abstract
     * @param {number} no
     */
    boxcolor(no) {
    }

}
