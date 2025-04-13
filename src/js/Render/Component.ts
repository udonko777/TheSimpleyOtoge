import { renderableObject } from "./TomoyoRender";

/**
 * RenderableObjectを返すことのできるコンポーネント
 */
export interface GraphicComponent {
  /**
   * 理想的には毎フレーム呼ばれる描画メソッド
   */
  draw(
    time: DOMHighResTimeStamp,
  ): void | Array<renderableObject> | renderableObject;
}

export const isGraphicComponent = (object: unknown): object is GraphicComponent => {
  if (typeof object !== "object" || object === null) {
    return false;
  }
  const component = object as GraphicComponent;
  return typeof component.draw === "function";
};