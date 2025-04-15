import { BarLine } from "../BarLine"
import { Note } from "./Note";

import { renderableObject } from "../../Render/TomoyoRender";

type ScrollableObjects = (Note | BarLine)[];

/* unused! */
export interface ScrollableObject {
  perfectTiming: number;
}

//製作途中。ノーツはジャッジ可能なオブジェクトでもあるが
//同時に小節線のように描画可能なオブジェクトでもある
//ジャッジを行うとノーツの状態が変化してしまうため二つのClassに分けることが出来ない。
//そこで、ノーツの集合の状態を別に管理してViewに渡すことにしたい

export const draw = (scrollableObjectModel: ScrollableObjects, time: number) => {
  const graphics: renderableObject | renderableObject[] = [];

  scrollableObjectModel.forEach((s) => {
    const result = s.draw(time);
    if (Array.isArray(result)) {
      graphics.push(...result);
    } else {
      graphics.push(result);
    }
  });

  return graphics;
}

export const begin = (scrollableObjectModel: ScrollableObjects, time: number) => {
  scrollableObjectModel.forEach((s) => {
    s.begin(time);
  });
}