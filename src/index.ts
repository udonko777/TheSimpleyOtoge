import { GameRuntime } from "./ts/core/GameRuntime";
import { rhythmGame } from "./ts/myRhythmGame/rhythmGame";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  new GameRuntime(canvas, rhythmGame);
})

// hint: 本体はsrc/js/core/Game.ts