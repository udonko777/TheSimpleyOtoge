import { GameManager } from "./js/core/GameManager";

//HTML側BodyのonLordに書かれているので、この関数はBodyの読み込みが終わったら呼ばれるはず
window.startClock = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  new GameManager(canvas);
};

