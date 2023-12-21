import { makeText } from '../TomoyoRender';
import { GraphicComponent } from './Component';

/**
 * 現在のコンボ数を表示するView、実際にはJudgeViewと組み合わせて使う。
 * 現状conbo数のカウントとコンボ数の表示の両方をこのClassで行ってしまっているので、別々にしたい。
 */
export class ComboView implements GraphicComponent {

    private comboCount: number;

    constructor() {
        this.comboCount = 0;
    }

    //FIXME ViewなのにConboCountの論理的実装が行われている
    public addConboCount() {
        this.comboCount += 1;
    }

    public resetConboCount() {
        this.comboCount = 0;
    }

    public draw() {
        if (this.comboCount > 0) {
            return makeText(String(this.comboCount), 10, 100, "48px serif", 'rgb( 255, 102, 102)');
        }
        console.log("comboCount is zero");
    }
}
