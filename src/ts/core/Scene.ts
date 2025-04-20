import {
  renderableObject,
} from "../Render/TomoyoRender";
import { GraphicRequestHandler, isGraphicComponent } from "../Render/Component";

/**
 * ゲーム中の特定の場面を表す
 * ローディング画面や、プレイするステージを選択する画面など
 */
export class Scene implements GraphicRequestHandler {

  private Components: Array<GraphicRequestHandler | renderableObject>;

  constructor() {
    this.Components = [];
  }

  /**
   * @param Components `draw()`が呼ばれたとき描画する子コンポーネント
   */
  public setComponents(...Components: ReadonlyArray<GraphicRequestHandler | renderableObject | Array<renderableObject>>): void {
    this.Components.push(...Components.flat());
  }

  /**
   * セットされたすべてのrenderableObjectのdrawを呼び出す
   * @param time
   */
  public draw(time: number): renderableObject[] {
    const graphics: Array<renderableObject> = [];

    for (const component of this.Components) {

      let graph: renderableObject | renderableObject[] | void;
      if (isGraphicComponent(component)) {
        graph = component.draw(time);
      } else {
        //HACK drawが呼べないならrenderableObjectとして扱う。かなり危ういチェックなので要修正
        graph = component
      }

      // FIX 多重配列をどうする?
      if (graph != null) {
        if (Array.isArray(graph)) {
          graphics.push(...graph);
        } else {
          graphics.push(graph);
        }
      }

    }

    return graphics;
  }
}
