import { GraphicRequestHandler } from "../Render/Component";
import { Color, makeBox, renderableObject } from "../Render/TomoyoRender";

/**
 * 現在どの程度上手にプレイできているかを示すゲージ。
 * ゲージは0から65536までの値を持ち、0が最悪、65536が最高を示す。
 */
export class Gauge implements GraphicRequestHandler {
  private readonly MAX_GROOVE = 65536;
  private readonly GAUGE_BOX_NUMBER = 24;
  private readonly GAUGE_BOX_AS_GROOVE = this.MAX_GROOVE / this.GAUGE_BOX_NUMBER;

  private readonly STATE_X = 0;
  private readonly STATE_Y = 0;
  private readonly GAUGE_HEIGHT = 30;
  private readonly GAUGE_WIDTH = 320;
  private readonly GAUGE_VOID_WIDTH = 20;

  private readonly P_GREAT = 0;
  private readonly GREAT = 1000;
  private readonly GOOD = 100;
  private readonly BAD = -1200;
  private readonly POOR = 0;
  private readonly OVER = -2000;
  private readonly BREAK = 0;

  private readonly IS_TOLERANT = false;

  private groove = 22220;

  public draw(): renderableObject[] {
    const boxes: renderableObject[] = [];
    let usedArea = 0;

    for (let i = 0; i < this.GAUGE_BOX_NUMBER; i++) {
      boxes.push(this.createBox(i, usedArea));
      usedArea += this.getBoxWidth();
    }

    return boxes;
  }

  private createBox(index: number, usedArea: number): renderableObject {
    const color = this.boxColor(index);
    const x = usedArea + this.STATE_X;
    const y = this.STATE_Y;
    const width = this.getVisibleArea();
    const height = this.GAUGE_HEIGHT;

    return this.writeBox(color, x, y, width, height);
  }

  private getVisibleArea(): number {
    return (this.GAUGE_WIDTH - this.GAUGE_VOID_WIDTH) / this.GAUGE_BOX_NUMBER;
  }

  private getBoxWidth(): number {
    return this.getVisibleArea() + this.GAUGE_VOID_WIDTH / this.GAUGE_BOX_NUMBER;
  }

  protected writeBox(
    color: Color,
    x: number,
    y: number,
    boxwidth: number,
    boxheight: number,
  ): renderableObject {
    return makeBox(x, y, boxwidth, boxheight, color);
  }

  public setJudge(judgeName: string): void {
    const judgeMap: { [key: string]: number } = {
      PGREAT: this.P_GREAT,
      GREAT: this.GREAT,
      GOOD: this.GOOD,
      BAD: this.BAD,
      POOR: this.POOR,
      OVER: this.OVER,
      BREAK: this.BREAK,
    };

    this.groove += judgeMap[judgeName] ?? 0;
    this.groove = Math.max(0, Math.min(this.groove, this.MAX_GROOVE));
  }

  private boxColor(no: number): Color {
    const enableBoxNumber = Math.floor(this.groove / this.GAUGE_BOX_AS_GROOVE);
    return no < enableBoxNumber ? "#3ad132" : "#444444";
  }
}