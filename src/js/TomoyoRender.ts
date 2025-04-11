type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export type Box = {
  readonly type: `Box`;
  x: number;
  y: number;
  width: number;
  height: number;
  style: Color;
};

export const makeBox = (
  x: number,
  y: number,
  width: number,
  height: number,
  style: Color,
): Box => {
  return {
    type: `Box`,
    x,
    y,
    width,
    height,
    style,
  };
};

export type Text = {
  readonly type: `Text`;
  text: string;
  x: number;
  y: number;
  font: string;
  style: Color;
};

export const makeText = (
  text: string,
  x: number,
  y: number,
  font: string,
  style: Color,
): Text => {
  return {
    type: `Text`,
    text,
    x,
    y,
    font,
    style,
  };
};

export type renderableObject = Box | Text;

export type ScreenModel = Readonly<{
  ctx: CanvasRenderingContext2D;
  canvas_width: number;
  canvas_height: number;
}>;


export class TomoyoRender {
  private readonly Screen: ScreenModel;
  constructor(canvas: HTMLCanvasElement) {
    this.Screen = {
      ctx: canvas.getContext("2d") as CanvasRenderingContext2D,
      canvas_width: canvas.width,
      canvas_height: canvas.height,
    };
  }
  /**
 * 渡されたrenderableObjectを挿入順に書き出す
 * @param Screen
 * @param graphics
 */
  rendering(
    graphics: renderableObject[],
  ) {
    this.Screen.ctx.beginPath();

    for (const graph of graphics) {
      switch (graph.type) {
        case "Box":
          drawBox(this.Screen, graph);
          break;
        case "Text":
          drawText(this.Screen, graph);
          break;
        default:
          console.info(graph);
          // @ts-expect-error 型ガードをすり抜けてきたオブジェクトについて、詳細なエラーログを残す
          throw new Error(`Unknown type: ${graph.type}`);
      }
    }
  }

  clear() {
    this.Screen.ctx.clearRect(0, 0, this.Screen.canvas_width, this.Screen.canvas_height);
  }

}

/** `ctx.fillRect`の代わりに用意された描画メソッド */
const drawBox = (Screen: ScreenModel, box: Box) => {
  Screen.ctx.fillStyle = box.style;
  Screen.ctx.fillRect(box.x, box.y, box.width, box.height);
};

/** `ctx.fillText`の代わりに用意された描画メソッド */
const drawText = (Screen: ScreenModel, text: Text) => {
  Screen.ctx.fillStyle = text.style;
  Screen.ctx.font = text.font;
  Screen.ctx.fillText(text.text, text.x, text.y);
};


