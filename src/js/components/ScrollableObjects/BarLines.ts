import { BarLine } from "../BarLine";
import { GraphicComponent } from "../../Render/Component";
import { renderableObject } from "../../Render/TomoyoRender";

export class BarLines implements GraphicComponent {
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