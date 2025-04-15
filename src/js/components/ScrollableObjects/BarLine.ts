import { makeBox, renderableObject } from "../../Render/TomoyoRender";
import { GraphicRequestHandler } from "../../Render/Component";

/**
 * プレイ画面中の小節線を描画するクラス
 */
export class BarLine implements GraphicRequestHandler {
  private readonly height: number;
  private width: number;
  private readonly perfectTiming: number;

  private beginTime: number;
  private scrollSpeedForBPM: number;

  constructor(
    height: number,
    width: number,
    perfectTiming: number,
    bpm: number,
  ) {
    this.height = height;
    this.width = width;

    this.perfectTiming = perfectTiming;

    this.scrollSpeedForBPM = bpm / 120;

    this.beginTime = 0;
  }

  public begin(now: DOMHighResTimeStamp): void {
    this.beginTime = now;
  }

  public draw(now: DOMHighResTimeStamp): renderableObject[] {
    const elapsedTime = now - this.beginTime;

    const JUDGE_LINE_POSITION = 500;

    const y =
      elapsedTime * this.scrollSpeedForBPM -
      this.perfectTiming +
      JUDGE_LINE_POSITION;
    //判定位置生成
    return [makeBox(0, y, this.width, this.height, "rgb( 100, 100, 100)")];
  }

  /**
   * 親コンポーネントに変化があったときに親から呼ばれる
   */
  public setSize(width: number) {
    this.width = width;
  }
}
