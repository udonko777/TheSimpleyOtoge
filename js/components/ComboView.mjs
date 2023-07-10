'use strict';
/**
 * 現在のコンボ数を表示するView、実際にはJudgeViewと組み合わせて使う。
 * 現状conbo数のカウントとコンボ数の表示の両方をこのClassで行ってしまっているので、別々にしたい。
*/
export class ComboView {

    constructor(ctx) {
        this.ctx = ctx;
        this.combocount = 0;
    }

    //FIXME ViewなのにConboCountの論理的実装が行われている
    addConboCount() {
        this.combocount += 1;
    }

    resetConboCount() {
        this.combocount = 0;
    }

    writeConboCount() {
        if (this.combocount > 0) {
            this.ctx.fillStyle = 'rgb( 255, 102, 102)';
            this.ctx.font = "48px serif";
            this.ctx.fillText(this.combocount, 10, 100);
        } else {
            console.log("comboocunt is zero");
        }
    }
}
