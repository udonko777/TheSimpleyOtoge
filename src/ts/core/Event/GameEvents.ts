import { renderableObject } from '../../Render/TomoyoRender';

export type GameEventMap = {
  init: void;
  firstFrame: void;
  updateFrame: number; // time
  keyInput: KeyboardEvent;
  resize: { width: number; height: number };
  render: renderableObject[];
};