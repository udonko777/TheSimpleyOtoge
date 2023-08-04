import { TomoyoRender } from "TomoyoRender";
import { GraphicComponent } from "./Component";

export class BarLine implements GraphicComponent{

    private render:TomoyoRender;
    private height:number;
    private width:number;

    constructor(render:TomoyoRender,height:number,width:number){
        this.render = render;

        this.height = height;
        this.width = width;
    }

    /**
     * 親コンポーネントに変化があったときに親から呼ばれる
     */
    setSize(height : number ,width :number){
        this.height = height;
        this.width = width;
    }

    draw(): void {
        //判定位置生成
        this.render.drawBox(0, 502, this.width, this.height, 'rgb( 0, 255, 0)');
    }
}