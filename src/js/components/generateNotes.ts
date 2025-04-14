import { Measure } from "../Parser/parser";
import { Note } from "./Note";

import { BarLine } from "./BarLine";

/** プレイ中、レーンに流れてくる可能性のあるオブジェクト */
type musicalElements = [
  Note:Array<Note>,
  BarLine:Array<BarLine>
]

/**
 * bmeファイルから読み込んだ小節の配列を元に、実際に処理されるノーツの配列を生成する。
 * @param Measures 小節の配列。小節にはどのタイミングでどの位置にノーツを配置するべきかの情報が含まれている。
 * @returns 
 */
export const generateNotes = (Measures: ReadonlyArray<Measure>): musicalElements => {
  const musicalElements: musicalElements = [[],[]];

  const NOTE_WIDTH: number = 80;

  const BARLINE_HEIGHT: number = 2;
  const BARLINE_WIDTH: number = 200;

  for (const measure of Measures) {

    musicalElements[1].push(
      new BarLine(BARLINE_HEIGHT, BARLINE_WIDTH, measure.beginTime, 120)
    )

    for (const [timing, position] of measure.notePositions) {
      musicalElements[0].push(
        new Note(position, timing + measure.beginTime, NOTE_WIDTH, 120),
      );
    }
  }

  return musicalElements;
};
