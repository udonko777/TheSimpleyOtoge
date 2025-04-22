// 共通ユーティリティや関数
import { getCurrentTime } from "../core/common/Time";
import { makeText, renderableObject } from "../Render/TomoyoRender";
import { parse } from "./Parser/parser";

// 音楽関連
import { MusicPlayer } from "../MusicPlayer";

// コンポーネント
import { ComboView } from "./components/ComboView";
import { JudgeView } from "./components/JudgeView";
import { BackGround } from "./components/BackGround";
import { Scene } from "../core/Scene";
import { Gauge } from "./components/Gauge";
import { Bomb } from "./components/Bomb";

// スクロール可能なオブジェクト
import { Note } from "./components/ScrollableObjects/Note";
import { BarLine } from "./components/ScrollableObjects/BarLine";
import { JudgeableNotes } from "./components/ScrollableObjects/JudgeableNotes";
import { BarLines } from "./components/ScrollableObjects/BarLines";

// ノート生成
import { generateNotes } from "./components/generateNotes";

// リソース
import bmeFile from "../../resource/demo/darksamba/_dark_sambaland_a.bme";
import { Game } from "../core/Game";

type EZjudge = "GREAT" | "GOOD" | "BAD" | "POOR" | "OVER" | "NOTHING";
type comboStrategy = "keep" | "up" | "reset";

const judgeToStrategy: ReadonlyMap<EZjudge, comboStrategy> = new Map([
  ["GREAT", "up"],
  ["GOOD", "up"],
  ["BAD", "reset"],
  ["POOR", "reset"],
  ["OVER", "reset"],
]);

const laneMap: Record<string, 0 | 1 | 2 | 3> = {
  KeyD: 0,
  KeyF: 1,
  KeyJ: 2,
  KeyK: 3,
};

export class rhythmGame implements Game {
  private judgeView: JudgeView;
  private comboView: ComboView;
  private backGround: BackGround;
  private barLines: BarLines;
  private bombs: Array<Bomb>;
  private playScene: Scene;
  private Notes: JudgeableNotes;
  private gauge: Gauge | undefined;
  private screenWidth: number = 0;
  private screenHeight: number = 0;

  /** Game開始のための準備、いろいろ読み込んでstartGameを可能にする。*/
  constructor() {
    this.judgeView = new JudgeView();
    this.comboView = new ComboView();
    this.backGround = new BackGround(this.screenHeight, this.screenWidth);
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
  }

  /** ゲームを開始する */
  public onFirstFrame = (): void => {
    const now = getCurrentTime();
    console.log(`Game started at: ${now}`);
    this.Notes.begin(now);
    this.barLines.begin(now);
    playMusic();
  }

  //gameが実際に始まる前までに表示し続ける表示
  public onInitialized = (): renderableObject[] => {
    this.backGround.setSize(this.screenHeight, this.screenWidth);
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

    return waitingScene.draw(0);
  }

  /** メインループ */
  public onUpdateFrame = (now: number): renderableObject[] => {
    this.backGround.setSize(this.screenHeight, this.screenWidth);
    this.barLines.setSize(this.screenWidth);

    const graphics = this.playScene.draw(now);

    for (const bomb of this.bombs) {
      const graph = bomb.draw();
      if (graph) graphics.push(graph);
    }

    this.handleExceededNotes(now);

    return graphics;
  }

  /** キー入力を処理する */
  public onKeyInput = (e: KeyboardEvent): void => {
    if (e.repeat) return;

    const laneID = laneMap[e.code];
    if (laneID !== undefined) {
      this.judgeTiming(laneID);
    }
  }

  /*
  HACK: ランタイムから呼ばれる。
  ユーザー定義の関数としてはふさわしくないので、修正が必要
  */
  public onResize = (width: number, height: number): void => {
    this.screenWidth = width;
    this.screenHeight = height;
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