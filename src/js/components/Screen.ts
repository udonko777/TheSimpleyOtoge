import { clear, draw, renderableObject, ScreenModel } from "../TomoyoRender";
import { GraphicComponent } from "./Component";

export class Screen implements GraphicComponent {

    private readonly ctx: CanvasRenderingContext2D;
    private canvas_width: number;
    private canvas_height: number;

    private Components: Array<GraphicComponent>;

    constructor(canvas: HTMLCanvasElement) {

        const ctx = canvas.getContext('2d');

        this.Components = [];

        if (!ctx) {
            throw new Error(`ctx nai yo`);
        }
        this.ctx = ctx;

        //canvasの形は不定形
        this.canvas_width = canvas.width;
        this.canvas_height = canvas.height;

    }

    setComponents(...Component: GraphicComponent[]): void {
        for(const component of Component){
            this.Components.push(component);
        }
    }

    /**
     * セットされたすべてのrenderableObjectのdrawを呼んでrenderに描かせる
     * @param time 
     */
    draw(time: number): void {

        const graphics: Array<renderableObject> = [];

        for (const component of this.Components) {

            const graph: renderableObject | renderableObject[] | void = component.draw(time);

            if (graph != null) {
                if (Array.isArray(graph)) {
                    graphics.push(...graph);
                } else {
                    graphics.push(graph);
                }
            }

        }

        const model: ScreenModel = {
            ctx: this.ctx,
            canvas_height: this.canvas_height,
            canvas_width: this.canvas_width
        }

        for (const graph of graphics) {
            draw(model, graph);
        }

    }

    /**
     * @deprecated
     * とりあえず動かすために、viewを介さずにグラフィックを描画する関数。
     * 本来ここにあるべきではないので、最終的に削ること。
     */
    public directRender(...graphs: renderableObject[]) {

        const model: ScreenModel = {
            ctx: this.ctx,
            canvas_height: this.canvas_height,
            canvas_width: this.canvas_width
        }

        for (const graph of graphs) {
            draw(model, graph);
        }

    }

    clear() {
        const model: ScreenModel = {
            ctx: this.ctx,
            canvas_height: this.canvas_height,
            canvas_width: this.canvas_width
        }

        clear(model);
    }


}