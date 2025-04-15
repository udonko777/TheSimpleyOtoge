import type { BarLine } from "./BarLine";
import type { GraphicRequestHandler } from "../../../Render/Component";
import type { renderableObject } from "../../../Render/TomoyoRender";

/**
 * プレイ画面中の小節線の集合
 */
export class BarLines implements GraphicRequestHandler {
  private barLines: BarLine[];

  constructor(barLines: BarLine[]) {
    this.barLines = barLines;
  }

  public draw(time: number): renderableObject[] {
    const graphics: renderableObject[] = [];

    for (const barLine of this.barLines) {
      const graphic = barLine.draw(time);
      if (graphic != null) {
        graphics.push(...graphic);
      }
    }

    return graphics;
  }

  public begin(time: number): void {
    for (const barLine of this.barLines) {
      barLine.begin(time);
    }
  }

  public setSize(width: number): void {
    for (const barLine of this.barLines) {
      barLine.setSize(width);
    }
  }

}