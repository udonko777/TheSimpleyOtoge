import { Game } from "./Game";
import { TomoyoRender } from "../Render/TomoyoRender";

import { getCurrentTime } from "./common/Time";

type GamePhase = "waiting" | "playing" | "ended";

/**
  * ゲームの実行環境
  */
export class GameRuntime {
  private state: GamePhase = "waiting";
  private gameInstance: Game;
  private readonly render: TomoyoRender;

  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvas: HTMLCanvasElement, game: Game) {
    this.gameInstance = game;
    this.render = new TomoyoRender(canvas);

    // 更新処理未実装
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    // 初期化
    this.gameInstance.onResize(this.canvasWidth, this.canvasHeight);

    this.render.rendering(this.gameInstance.onInitialized());

    this.bindInput();
  }

  private bindInput() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  private handleKeydown = (e: KeyboardEvent) => {
    if (this.state === "waiting") {
      this.startGame();
    } else if (this.state === "playing") {
      this.gameInstance.onKeyInput(e);
    }
  }

  private frame = () => {
    const now = getCurrentTime();

    // TODO: Canvasのサイズが変更されたときに、リサイズを行う
    this.gameInstance.onResize(this.canvasWidth, this.canvasHeight);

    this.render.clear();
    this.render.rendering(this.gameInstance.onUpdateFrame(now));

    if (this.state === "playing") {
      window.requestAnimationFrame(this.frame);
    }
  };

  private startGame() {
    this.state = "playing";
    this.gameInstance.onFirstFrame();

    window.requestAnimationFrame(this.frame); // メインループ開始
  }

  public stopGame() {
    this.state = "ended";
    // 終了処理など
  }
}