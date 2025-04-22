import type { renderableObject } from "../Render/TomoyoRender";

export interface Game {
  onInitialized(): renderableObject[];
  onFirstFrame(): void;
  onUpdateFrame(time:number): renderableObject[];
  onKeyInput(e: KeyboardEvent): void;
  onResize(width: number, height: number): void;
}