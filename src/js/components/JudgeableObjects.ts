import { Note } from "./Note";
import { GraphicComponent } from "../Render/Component";
import { renderableObject } from "../Render/TomoyoRender";

/**
perfectTimingをプロパティに持つオブジェクトの集合
*/
export class JudgeableObjects implements GraphicComponent {
  // NoteID == LaneID
  private noteIDToNotes: Map<number, Array<Readonly<Note>>>;

  constructor(notes: ReadonlyArray<Note>) {
    const noteIDToNotes: Map<number, Array<Note>> = new Map();

    this.noteIDToNotes = new Map();

    // Map.GroupBy(notes,note => note.no) の代替実装
    for (const note of notes) {
      if (noteIDToNotes.has(note.no)) {
        noteIDToNotes.get(note.no)!.push(note);
      } else {
        noteIDToNotes.set(note.no, []);
      }
    }

    // それぞれの配列を、perfectTimingの昇順にソート (正しく動かないかもしれない)
    for (const noteID of noteIDToNotes.keys()) {
      noteIDToNotes.get(noteID)!.sort((a, b) => {
        return a.perfectTiming - b.perfectTiming;
      });
    }

    this.noteIDToNotes = noteIDToNotes;

    console.info(this.noteIDToNotes);
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
      notes.forEach((note) => {
        graphics.push(note.draw(time));
      });
    }

    return graphics;
  }

  public begin(time: number) {
    for (const notes of this.noteIDToNotes.values()) {
      notes.forEach((note) => {
        note.begin(time);
      });
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
   * あるレーンの押されたタイミングに対して判定を返す。有効な判定の範囲にノーツがなかった場合は'NOTHING'を返す
   * @param timing
   * @param laneID
   * @returns
   */
  public getJudge(timing: number, laneID: number) {
    const pushedLanesNotes = this.noteIDToNotes.get(laneID);

    if (pushedLanesNotes == null) {
      console.log("そのキー、対応するレーンないよ");
      return "ERROR";
    }

    let minimumDifference: number = Infinity;
    let minimumDifferenceNoteIndex: number = -1;

    //押されたレーンに対して、そのレーンに配置された全ノーツを見ていき最も差が小さかったものを見つける
    for (const [i, note] of pushedLanesNotes.entries()) {

      const difference = JudgeableObjects.calculateDifference(note, timing);

      if (difference < minimumDifference) {
        minimumDifference = difference;
        minimumDifferenceNoteIndex = i;
      }
    }

    const result = this.judging(minimumDifference);

    //最も差が小さかったノーツが一定の範囲に収まった場合に、判定対象として判定を返す
    if ("NOTHING" !== result) {
      //Arrayのサイズがこれのせいで動的に変わる
      pushedLanesNotes.splice(minimumDifferenceNoteIndex, 1);
    }

    return result;
  }
}
