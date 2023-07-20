type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

/*
 * 描画処理を集約するための一時的な実装。
 * 段階的に依存関係を解消する
 */
export class TomoyoRender {

    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    /** `ctx.fillRect`の代わりに用意された描画メソッド */
    public drawBox(x: number, y: number, width: number, height: number, style: string) {
        this.ctx.fillStyle = style;
        this.ctx.fillRect(x, y, width, height);
    }

    /** `ctx.fillText`の代わりに用意された描画メソッド */
    public drawText(text: string, x: number, y: number, font: string, style: string) {
        this.ctx.fillStyle = style;
        this.ctx.font = font;
        this.ctx.fillText(text, x, y);
    }
}