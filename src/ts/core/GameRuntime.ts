import { TomoyoRender } from "../Render/TomoyoRender";

import { getCurrentTime } from "./common/Time";
import { GameEventHub } from "./Event/GameEventHub";
import { GameEventMap } from "./Event/GameEvents";

type GamePhase = "waiting" | "playing" | "ended";

/**
  * ゲームの実行環境
  * 所謂ゲームエンジンに相当する場面であるため、このクラスからゲームロジック部分に直接依存してはならない
  */
export class GameRuntime {
  private state: GamePhase = "waiting";
  private readonly render: TomoyoRender;

  private canvasWidth: number;
  private canvasHeight: number;

  private readonly hub: GameEventHub<GameEventMap>;

  constructor(canvas: HTMLCanvasElement, game: (eventHub: GameEventHub<GameEventMap>) => void) {
    this.hub = new GameEventHub<GameEventMap>()
    game(this.hub);
    this.render = new TomoyoRender(canvas);

    this.hub.on("render", (graphics) => {
      this.render.rendering(graphics);
    });

    // 更新処理未実装
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    // 初期化
    this.hub.emit("resize", {
      width: this.canvasWidth,
      height: this.canvasHeight,
    });
    this.hub.emit("init", undefined);

    this.hub.on("firstFrame", () => { });

    this.bindInput();
  }

  private bindInput() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  private handleKeydown = (e: KeyboardEvent) => {
    if (this.state === "waiting") {
      this.startGame();
    } else if (this.state === "playing") {
      this.hub.emit("keyInput", e);
    }
  }

  private frame = () => {
    const now = getCurrentTime();

    // TODO: Canvasのサイズが変更されたときに、リサイズを行う
    this.hub.emit("resize", {
      width: this.canvasWidth,
      height: this.canvasHeight,
    });

    this.render.clear();
    this.hub.emit("updateFrame", now);

    if (this.state === "playing") {
      window.requestAnimationFrame(this.frame);
    }
  };

  private startGame() {
    this.state = "playing";
    this.hub.emit("firstFrame", undefined);

    window.requestAnimationFrame(this.frame); // メインループ開始
  }

  public stopGame() {
    this.state = "ended";
    // 終了処理など
  }
}