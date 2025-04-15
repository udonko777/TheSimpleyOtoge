import { renderableObject } from "./TomoyoRender";

/**
 * 描画を行うコンポーネントのインターフェース
 */
export interface GraphicRequestHandler {
  /**
   * 理想的には毎フレーム呼ばれる描画メソッド
   */
  draw(
    time: DOMHighResTimeStamp,
  ): void | Array<renderableObject> | renderableObject;
}

export const isGraphicComponent = (object: unknown): object is GraphicRequestHandler => {
  if (typeof object !== "object" || object === null) {
    return false;
  }
  const component = object as GraphicRequestHandler;
  return typeof component.draw === "function";
};