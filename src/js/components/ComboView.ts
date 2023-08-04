import { TomoyoRender } from 'TomoyoRender';
import { GraphicComponent } from './Component';

/**
 * 現在のコンボ数を表示するView、実際にはJudgeViewと組み合わせて使う。
 * 現状conbo数のカウントとコンボ数の表示の両方をこのClassで行ってしまっているので、別々にしたい。
 */
export class ComboView implements GraphicComponent {

    readonly render: TomoyoRender;
    comboCount: number;

    constructor(render: TomoyoRender) {
        this.render = render;
        this.comboCount = 0;
    }

    //FIXME ViewなのにConboCountの論理的実装が行われている
    addConboCount() {
        this.comboCount += 1;
    }

    resetConboCount() {
        this.comboCount = 0;
    }

    draw() {
        if (this.comboCount > 0) {
            this.render.drawText(String(this.comboCount), 10, 100, "48px serif", 'rgb( 255, 102, 102)');
        } else {
            console.log("comboCount is zero");
        }
    }
}
