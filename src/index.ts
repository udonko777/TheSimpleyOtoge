import { GameManager } from "./js/core/GameManager";

//HTML側BodyのonLordに書かれているので、この関数はBodyの読み込みが終わったら呼ばれるはず
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  new GameManager(canvas);
})

