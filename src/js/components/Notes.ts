
import { TomoyoRender } from "TomoyoRender";
import { Measure } from "../Parser/parser";
import { Note } from "./Note";

export const generateNotes = (render: TomoyoRender, Measures: ReadonlyArray<Measure>): Note[] => {
    
    const notes: Note[] = [];
    const NOTE_WIDTH: number = 80;

    for (const measure of Measures) {
        for (const [timing, position] of measure.notePositions) {
            notes.push(
                new Note(render, position, timing + measure.beginTime, 1, NOTE_WIDTH, 120)
            )
        }
    }

    return notes;

}