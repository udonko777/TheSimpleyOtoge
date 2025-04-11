import { Game } from "./Game";

type GamePhase = "waiting" | "playing" | "ended";

/**
  * ゲームの状態を管理するクラス
  */
export class GameManager {
  private state: GamePhase = "waiting";
  private gameInstance: Game;

  constructor(canvas: HTMLCanvasElement) {
    this.gameInstance = new Game(canvas);
    this.bindInput();
  }

  private bindInput() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  private handleKeydown = (e: KeyboardEvent) => {
    if (this.state === "waiting") {
      this.startGame();
    } else if (this.state === "playing") {
      this.gameInstance.handleKeyPress(e); // Gameクラス内で処理
    }
  };

  private startGame() {
    this.state = "playing";
    this.gameInstance.start(); // 実ゲームの開始処理
  }

  public stopGame() {
    this.state = "ended";
    // 終了処理など
  }
}