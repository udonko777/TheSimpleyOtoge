

import { Measure } from "../Parser/parser";
import { Note } from "./Note";

export const generateNotes = (Measures: ReadonlyArray<Measure>): Note[] => {
    
    const notes: Note[] = [];
    const NOTE_WIDTH: number = 80;

    for (const measure of Measures) {
        for (const [timing, position] of measure.notePositions) {
            notes.push(
                new Note(position, timing + measure.beginTime, NOTE_WIDTH, 120)
            )
        }
    }

    return notes;

}