import type { renderableObject } from "../Render/TomoyoRender";

export interface Game {
  start(): void;
  handleKeyPress(e: KeyboardEvent): void;
  initialized(): renderableObject[];
  frame(time:number): renderableObject[];
  resize(width: number, height: number): void; // 追加
}