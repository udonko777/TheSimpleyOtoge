import type { Note } from "./Note";
import type { GraphicComponent } from "../../Render/Component";
import type { renderableObject } from "../../Render/TomoyoRender";

/**
 * ノートの集合を管理し、判定や描画を行うクラス
 */
export class JudgeableNotes implements GraphicComponent {
  // NoteID == LaneID
  private readonly noteIDToNotes: Map<number, Array<Readonly<Note>>>;

  constructor(notes: ReadonlyArray<Note>) {
    this.noteIDToNotes = JudgeableNotes.groupAndSortNotesByLane(notes);

    console.info(this.noteIDToNotes);
  }

  /**
   * ノートをレーンごとにグループ化し、perfectTimingの昇順にソート
   */
  private static groupAndSortNotesByLane(notes: ReadonlyArray<Note>): Map<number, Array<Readonly<Note>>> {
    const map = new Map<number, Array<Readonly<Note>>>();

    // Map.groupBy()が使えれば置き換えられる
    for (const note of notes) {
      if (!map.has(note.no)) {
        map.set(note.no, []);
      }
      map.get(note.no)!.push(note);
    }

    for (const laneNotes of map.values()) {
      laneNotes.sort((a, b) => a.perfectTiming - b.perfectTiming);
    }

    return map;
  }

  private static calculateDifference(note: Readonly<Note>, timing: number): number {
    return Math.abs(note.perfectTiming + note.getSTART_TIME() - timing);
  }

  /**
   * ノートが判定によって消費されない場合Nothingが返る
   * @param difference
   */
  private judging(difference: number): string {
    const b = difference;

    if (260 > b && -260 < b) {
      if (50 > b && -50 < b) {
        console.log(`GREAT!, difference : ${b} ms`);
        return "GREAT";
      } else if (100 > b && -100 < b) {
        return "GOOD";
      } else if (120 > b && -120 < b) {
        return "BAD";
      } else if (140 > b && -140 < b) {
        return "POOR";
      }
    }
    return "NOTHING";
  }

  public draw(time: number) {
    const graphics: renderableObject[] = [];

    for (const notes of this.noteIDToNotes.values()) {
      for (const note of notes) {
        graphics.push(note.draw(time));
      }
    }

    return graphics;
  }

  public begin(time: number) {
    for (const notes of this.noteIDToNotes.values()) {
      for (const note of notes) {
        note.begin(time);
      }
    }
  }

  /**
   * 超過した分のノーツの数を返す。超過した分は削除
   * @param time
   */
  public checkExceeded(time: number) {
    let response = 0;

    for (const note of this.noteIDToNotes.values()) {
      for (let i = 0; i < note.length; i++) {
        if (note[i].isOVER(time)) {
          response += 1;
          note.splice(i, 1);
        }
      }
    }

    return response;
  }

  /**
   * 指定されたレーンとタイミングに対して判定を返す。
   * 有効な判定の範囲にノーツがなかった場合は'NOTHING'を返す
   * @param timing
   * @param laneID
   * @returns
   */
  public getJudge(timing: number, laneID: number): string {
    const laneNotes = this.noteIDToNotes.get(laneID);

    if (!laneNotes || laneNotes.length === 0) {
      console.log("そのキー、対応するレーンないよ");
      return "ERROR";
    }

    let minimumDifference: number = Infinity;
    let closestNoteIndex: number = -1;

    //押されたレーンに対して、そのレーンに配置された全ノーツを見ていき最も差が小さかったものを見つける
    for (const [i, note] of laneNotes.entries()) {

      const difference = JudgeableNotes.calculateDifference(note, timing);

      if (difference < minimumDifference) {
        minimumDifference = difference;
        closestNoteIndex = i;
      }
    }

    const result = this.judging(minimumDifference);

    // 判定が有効な場合、該当ノートを削除
    if (result !== "NOTHING" && closestNoteIndex !== -1) {
      laneNotes.splice(closestNoteIndex, 1);
    }

    return result;
  }
}
