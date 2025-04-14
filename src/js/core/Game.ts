import { ComboView } from "../components/ComboView";

import { Note } from "../components/Note";
import { generateNotes } from "../components/generateNotes";

import { JudgeView } from "../components/JudgeView";

import { Bomb } from "../components/Bomb";

import { MusicPlayer } from "../MusicPlayer";

import { getCurrentTime } from "../common/Time";
import { makeText } from "../Render/TomoyoRender";

import { parse } from "../Parser/parser";

import { Scene } from "../components/Scene";
import { TomoyoRender } from "../Render/TomoyoRender";

import bmeFile from "../../resource/demo/darksamba/_dark_sambaland_a.bme";

import { BackGround } from "../components/BackGround";

import { BarLine } from "../components/BarLine";

import { Gauge } from "../Gauges/Gauge";

import { JudgeableObjects } from "../components/JudgeableObjects";

//import {JUDGES} from '/jsons/judge.json'

type EZjudge = "GREAT" | "GOOD" | "BAD" | "POOR" | "OVER" | "NOTHING";
type comboStrategy = "keep" | "up" | "reset";

const judgeToStrategy: ReadonlyMap<EZjudge, comboStrategy> = new Map([
  ["GREAT", "up"],
  ["GOOD", "up"],
  ["BAD", "reset"],
  ["POOR", "reset"],
  ["OVER", "reset"],
]);

export class Game {
  private judgeView: JudgeView;
  private comboView: ComboView;
  private backGround: BackGround;
  private barLine: BarLine;
  private notes: Note[];
  private bombs: Bomb[];
  private playScene: Scene;
  private judgeableObjects: JudgeableObjects;
  private gauge: Gauge | undefined;
  private render: TomoyoRender;
  private exitMain: number | undefined;
  private canvasHeight: () => number;
  private canvasWidth: () => number;

  /** Game開始のための準備、いろいろ読み込んでstartGameを可能にする。*/
  constructor(canvas: HTMLCanvasElement) {
    //HACK canvasのサイズは実行中に変化する可能性がある為に、canvasのサイズを動的に入手する手段を持たせている。
    //もっといい方法が思いつけばそれを採用する。
    this.canvasHeight = () => {
      return canvas.height;
    };
    this.canvasWidth = () => {
      return canvas.width;
    };

    this.render = new TomoyoRender(canvas);

    this.judgeView = new JudgeView();
    this.comboView = new ComboView();
    this.backGround = new BackGround(canvas.height, canvas.width);
    this.barLine = new BarLine(2, canvas.width, 4448, 120);

    const chart = parse(bmeFile);
    this.notes = generateNotes(chart);
    this.judgeableObjects = new JudgeableObjects(this.notes);

    this.playScene = new Scene();
    this.playScene.setComponents(
      this.backGround,
      this.judgeView,
      this.comboView,
      this.barLine,
      this.judgeableObjects,
      new Gauge(),
    );

    this.bombs = Array.from({ length: 4 }, (_, i) => new Bomb(i, 0, 80));

    //ゲームが実際に起動されるまで表示される待ち受け画面。
    this.inputWaitingScreen();
  }

  /** ゲームを開始する */
  public start(): void {
    const now = getCurrentTime();
    console.log(`Game started at: ${now}`);
    this.judgeableObjects.begin(now);
    this.barLine.begin(now);
    playMusic();
    this.startMainLoop();
  }

  //gameが実際に始まる前までに表示し続ける表示
  private inputWaitingScreen() {
    const backGrounds = this.backGround.draw();

    const waitingScene = new Scene()
    waitingScene.setComponents([
      ...backGrounds,
      makeText(
        "キーボード押すと音が鳴るよ",
        50,
        100,
        "21px serif",
        "rgb( 255, 102, 102)",
      ),
      makeText("爆音なので注意", 50, 120, "21px serif", "rgb( 255, 102, 102)"),
    ]);

    this.render.rendering(waitingScene.draw(0));
  }

  /** メインループを開始 */
  private startMainLoop(): void {
    this.exitMain = window.requestAnimationFrame(this.frame);
  }

  /** メインループ */
  private frame = () => {
    //window.cancelAnimationFrame(this.exitMain)でメインループを抜けられる
    this.exitMain = window.requestAnimationFrame(this.frame);
    const now = getCurrentTime();

    //画面のリフレッシュ
    this.render.clear();

    //FIX 更新があってもなくても毎フレームリサイズしている。 canvasサイズの変更を受け取るハンドラから呼び出すべき
    this.backGround.setSize(this.canvasHeight(), this.canvasWidth());

    this.barLine.setSize(this.canvasWidth());

    this.render.rendering(this.playScene.draw(now));

    for (const bomb of this.bombs) {
      const graph = bomb.draw();
      if (graph != null) {
        //FIX ここで描画しているのは爆弾のグラフィックだけ
        //爆弾の状態管理の都合、いったん
        this.render.rendering([graph]);
      }
    }

    this.handleExceededNotes(now);
  };

  /** キー入力を処理する */
  public handleKeyPress(e: KeyboardEvent): void {
    if (e.repeat) return;

    const laneMap: Record<string, 0 | 1 | 2 | 3> = {
      KeyD: 0,
      KeyF: 1,
      KeyJ: 2,
      KeyK: 3,
    };

    const laneID = laneMap[e.code];
    if (laneID !== undefined) {
      this.judgeTiming(laneID);
    }
  }

  private sendJudge = (judge: EZjudge): void => {
    if (judge === "NOTHING") return;

    this.judgeView.setJudge(judge);
    this.gauge?.setJudge(judge);

    const strategy = judgeToStrategy.get(judge) ?? "keep";
    if (strategy === "up") {
      this.comboView.addComboCount();
    } else if (strategy === "reset") {
      this.comboView.resetComboCount();
    }
  };

  private judgeTiming(laneID: 0 | 1 | 2 | 3): void {
    const scoredJudge = this.judgeableObjects.getJudge(
      globalThis.performance.now(),
      laneID,
    ) as EZjudge; //後でちゃんとjudge型を返す
    this.sendJudge(scoredJudge);

    this.bombs[laneID].setBombLife(50);
  }

  /** 判定を超えたノーツを処理 */
  private handleExceededNotes(now: number): void {
    const exceededNotesCount = this.judgeableObjects.checkExceeded(now);
    for (let i = 0; i < exceededNotesCount; i++) {
      this.sendJudge("OVER");
    }
  }
}

/** 音楽を再生 */
const playMusic = (): void => {
  const musicPlayer = new MusicPlayer();
  musicPlayer.play();
}