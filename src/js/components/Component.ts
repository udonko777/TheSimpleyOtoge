export interface GraphicComponent {

    /** 理想的には毎フレーム呼ばれる描画メソッド
     * 
     */
    draw(time: DOMHighResTimeStamp): void;

}