// 共通ユーティリティや関数
import { getCurrentTime } from "../myRhythmGame/common/Time";
import { makeText } from "../Render/TomoyoRender";
import { parse } from "../myRhythmGame/Parser/parser";

// 音楽関連
import { MusicPlayer } from "../MusicPlayer";

// 描画関連
import { TomoyoRender } from "../Render/TomoyoRender";

// コンポーネント
import { ComboView } from "../myRhythmGame/components/ComboView";
import { JudgeView } from "../myRhythmGame/components/JudgeView";
import { BackGround } from "../myRhythmGame/components/BackGround";
import { Scene } from "./Scene";
import { Gauge } from "../myRhythmGame/components/Gauge";
import { Bomb } from "../myRhythmGame/components/Bomb";

// スクロール可能なオブジェクト
import { Note } from "../myRhythmGame/components/ScrollableObjects/Note";
import { BarLine } from "../myRhythmGame/components/ScrollableObjects/BarLine";
import { JudgeableNotes } from "../myRhythmGame/components/ScrollableObjects/JudgeableNotes";
import { BarLines } from "../myRhythmGame/components/ScrollableObjects/BarLines";

// ノート生成
import { generateNotes } from "../myRhythmGame/components/generateNotes";

// リソース
import bmeFile from "../../resource/demo/darksamba/_dark_sambaland_a.bme";

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
  private barLines: BarLines;
  private bombs: Array<Bomb>;
  private playScene: Scene;
  private Notes: JudgeableNotes;
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
    this.gauge = new Gauge();

    const chart = parse(bmeFile);
    const musicalElements: [Array<Note>, Array<BarLine>] = generateNotes(chart);
    this.Notes = new JudgeableNotes(musicalElements[0]);
    this.barLines = new BarLines(musicalElements[1]);

    this.playScene = new Scene();
    this.playScene.setComponents(
      this.backGround,
      this.judgeView,
      this.comboView,
      this.barLines,
      this.Notes,
      this.gauge
    );

    this.bombs = Array.from({ length: 4 }, (_, i) => new Bomb(i, 0, 80));

    //ゲームが実際に起動されるまで表示される待ち受け画面。
    this.inputWaitingScreen();
  }

  /** ゲームを開始する */
  public start = (): void => {
    const now = getCurrentTime();
    console.log(`Game started at: ${now}`);
    this.Notes.begin(now);
    this.barLines.begin(now);
    playMusic();
    this.startMainLoop();
  }

  //gameが実際に始まる前までに表示し続ける表示
  private inputWaitingScreen = (): void => {
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
  private startMainLoop = (): void => {
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

    this.barLines.setSize(this.canvasWidth());

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
  public handleKeyPress = (e: KeyboardEvent): void => {
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

  private judgeTiming = (laneID: 0 | 1 | 2 | 3): void => {
    const scoredJudge = this.Notes.getJudge(
      globalThis.performance.now(),
      laneID,
    ) as EZjudge; //後でちゃんとjudge型を返す
    this.sendJudge(scoredJudge);

    this.bombs[laneID].setBombLife(50);
  }

  /** 判定を超えたノーツを処理 */
  private handleExceededNotes = (now: number): void => {
    const exceededNotesCount = this.Notes.checkExceeded(now);
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