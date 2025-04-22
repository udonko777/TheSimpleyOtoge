// 共通ユーティリティや関数
import { getCurrentTime } from "../core/common/Time";
import { makeText} from "../Render/TomoyoRender";
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
import { JudgeableNotes } from "./components/ScrollableObjects/JudgeableNotes";
import { BarLines } from "./components/ScrollableObjects/BarLines";

// ノート生成
import { generateNotes } from "./components/generateNotes";

// リソース
import bmeFile from "../../resource/demo/darksamba/_dark_sambaland_a.bme";

import { GameEventHub} from "../core/Event/GameEventHub";
import { GameEventMap} from "../core/Event/GameEvents";

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

export const rhythmGame = (hub: GameEventHub<GameEventMap>) => {
  const judgeView = new JudgeView();
  const comboView = new ComboView();
  const gauge = new Gauge();
  const background = new BackGround(0, 0); // サイズは後でセット
  let barLines = new BarLines([]);
  const bombs = Array.from({ length: 4 }, (_, i) => new Bomb(i, 0, 80));
  const chart = parse(bmeFile);
  const [notesArray, barLinesArray] = generateNotes(chart);
  const judgeableNotes = new JudgeableNotes(notesArray);
  const playScene = new Scene();

  barLines = new BarLines(barLinesArray);
  playScene.setComponents(background, judgeView, comboView, barLines, judgeableNotes, gauge);

  let screenWidth = 0;
  let screenHeight = 0;

  const sendJudge = (judge: EZjudge) => {
    if (judge === "NOTHING") return;
    judgeView.setJudge(judge);
    gauge.setJudge(judge);
    const strategy = judgeToStrategy.get(judge) ?? "keep";
    if (strategy === "up") comboView.addComboCount();
    if (strategy === "reset") comboView.resetComboCount();
  };

  const judgeTiming = (laneID: 0 | 1 | 2 | 3) => {
    const scoredJudge = judgeableNotes.getJudge(performance.now(), laneID) as EZjudge;
    sendJudge(scoredJudge);
    bombs[laneID].setBombLife(50);
  };

  // イベント登録
  hub.on("resize", ({ width, height }) => {
    screenWidth = width;
    screenHeight = height;
    background.setSize(height, width);
    barLines.setSize(width);
  });

  hub.on("init", () => {
    // 背景＋待機中メッセージ
    const waitingScene = new Scene();
    waitingScene.setComponents([
      ...background.draw(),
      makeText("キーボード押すと音が鳴るよ", 50, 100, "21px serif", "rgb( 255, 102, 102)"),
      makeText("爆音なので注意", 50, 120, "21px serif", "rgb( 255, 102, 102)"),
    ]);
    hub.emit("render", waitingScene.draw(0));
  });

  hub.on("firstFrame", () => {
    const now = getCurrentTime();
    judgeableNotes.begin(now);
    barLines.begin(now);
    new MusicPlayer().play();
  });

  hub.on("keyInput", (e) => {
    if (e.repeat) return;
    const lane = laneMap[e.code];
    if (lane !== undefined) judgeTiming(lane);
  });

  hub.on("updateFrame", (now) => {
    background.setSize(screenHeight, screenWidth);
    barLines.setSize(screenWidth);

    const graphics = playScene.draw(now);
    for (const bomb of bombs) {
      const b = bomb.draw();
      if (b) graphics.push(b);
    }

    const exceeded = judgeableNotes.checkExceeded(now);
    for (let i = 0; i < exceeded; i++) sendJudge("OVER");

    hub.emit("render", graphics); // 新たに追加：描画のトリガー
  });
}