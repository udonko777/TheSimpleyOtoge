import { makeBox, renderableObject } from "TomoyoRender";
import { GraphicComponent } from "./Component";

export class BackGround implements GraphicComponent {

    height: number;
    width: number;

    constructor(height: number, width: number) {

        this.height = height;
        this.width = width;
        
    }

    /**
     * 親コンポーネントに変化があったときに親から呼ばれる
     */
    public setSize(height: number, width: number) {
        this.height = height;
        this.width = width;
    }

    public draw(): renderableObject[] {
        const DarkBackGround = makeBox(0, 0, this.width, this.height, 'rgb( 0, 0, 0)');

        //判定位置生成
        const judgeLine = makeBox(0, 502, this.width, 5, 'rgb( 0, 255, 0)');

        return [DarkBackGround, judgeLine]
    }

}