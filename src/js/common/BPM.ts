export type BPM = number;

export function isBPM(value: number): value is BPM {
    return value > 0 && value <= 1000;
}

/** BPMを受け取って、一小節あたりにかかる時間をミリ秒単位で返す
 * @param bpm - beat per minutes
 * @param beatsPerMeasure - 拍子の数。とりあえず分母が4であることを前提としてある
 * @returns - 一小節あたりに必要な時間(ms)
 */
export function calculateMillisecondsPerMeasure(bpm: BPM, beatsPerMeasure: number = 4): number {

    const millisecondsPerBeat = 60000 / bpm;
    const millisecondsPerMeasure = millisecondsPerBeat * beatsPerMeasure;
    return millisecondsPerMeasure;

}