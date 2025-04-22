
type Handler<T> = (payload: T) => unknown;

/**
 * ゲーム内のイベントを管理するクラス
 * ブラウザ標準のEventListenerを使うのではなく、独自のイベントシステムを利用することで
 * スコープを狭め、DOMへの依存を軽減させる狙いがある
 * @template TEventMap イベントの型を定義するマップ
 * @example
 * const eventHub = new GameEventHub<GameEventMap>();
 * eventHub.on("init", () => { console.log("Game initialized"); });
*/
export class GameEventHub<TEventMap extends Record<string, unknown>> {
  private listeners: {
    [K in keyof TEventMap]?: Handler<TEventMap[K]>[];
  } = {};

  /**
   * イベントを登録する
   * @param event イベント名
   * @param handler イベントハンドラ
   */
  on<K extends keyof TEventMap>(event: K, handler: Handler<TEventMap[K]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    if (!this.listeners[event]!.includes(handler)) {
      this.listeners[event]!.push(handler);
    }
  }

  /**
   * イベントを発火する
   * @param event 
   * @param payload 
   * @returns 
   */
  emit<K extends keyof TEventMap>(event: K, payload: TEventMap[K]) {
    if (!this.listeners[event]) {
      console.warn(`No listeners registered for event: ${String(event)}`);
      return;
    }
    this.listeners[event]!.forEach(handler => handler(payload));
  }

  /**
   * イベントを解除する
   * @param event イベント名
   * @param handler イベントハンドラ
   */
  off<K extends keyof TEventMap>(event: K, handler: Handler<TEventMap[K]>) {
    this.listeners[event] = this.listeners[event]?.filter(h => h !== handler);
  }
  /**
   * イベントをすべて解除する
   */
  clear() {
    this.listeners = {};
  }
}