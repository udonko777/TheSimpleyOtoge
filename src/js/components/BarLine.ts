import { TomoyoRender } from "TomoyoRender";
import { GraphicComponent } from "./Component";

export class BarLine implements GraphicComponent {

    private render: TomoyoRender;
    private height: number;
    private width: number;
    private perfectTiming: number;
    private bpm: number;

    beginTime: number;
    scrollSpeedForBPM: number;
    hiSpeed: number;

    constructor(render: TomoyoRender, height: number, width: number, perfectTiming: number, bpm: number) {
        this.render = render;

        this.height = height;
        this.width = width;

        this.perfectTiming = perfectTiming;
        this.bpm = bpm;

        this.scrollSpeedForBPM = bpm / 120

        this.hiSpeed = 1;
        this.beginTime = 0;
    }

    begin(now: DOMHighResTimeStamp) {
        this.beginTime = now;
    }

    /**
     * 親コンポーネントに変化があったときに親から呼ばれる
     */
    setSize(height: number, width: number) {
        this.height = height;
        this.width = width;
    }

    draw(now: DOMHighResTimeStamp): void {
        const elapsedTime = now - this.beginTime;
        const JUDGE_LINE_POSITION = 500;

        const y = (((elapsedTime * this.scrollSpeedForBPM) - this.perfectTiming) / this.hiSpeed) + JUDGE_LINE_POSITION;
        //判定位置生成
        this.render.drawBox(0, y, this.width, this.height, 'rgb( 100, 100, 100)');
    }
}