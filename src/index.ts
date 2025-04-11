import { GameManager } from "./js/core/GameManager";

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  new GameManager(canvas);
})

// hint: 本体はsrc/js/core/Game.ts