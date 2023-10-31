import { BMSChannelToKeyStatement, isConvertibleKeyChannel } from "./Config/chartConfig"

export type BMSMainDefinition = {
    /** 000 ~ 999 に収まる、何小節目かを表す数字*/
    measure: number,
    /** 00 ~ 99 */
    channel: number;
    /** 2文字の36進数の連続 */
    indexes: Array<string>;
}

export type Measure = {
    /** その小節が始まる時刻(ms) */
    beginTime: number;
    /** 落ちてくるタイミング 降ってくる場所 */
    notePositions: Map<number, number>;
}

export class Chart {

    constructor(countOfMeasures: number) {

    }
}

export class BMSParser {

    //TODO とりあえず手打ちで
    private BPM: number = 145;

    /** 全音符1回が対応する時間(ms) */
    private quarterNote: number = 240000 / this.BPM;

    private measures: any;

    constructor() {

    }

    public parse(SourceText: string) {
        const [MainDataFields, countOfMeasures] = this.tokenizer(SourceText) as any;
        this.scanner(MainDataFields, countOfMeasures);
    }

    private tokenizer(SourceText: string) {
        // [小節][チャンネル]:[定義]
        const mainDataFieldFinder = new RegExp(/#(\d{3})(\d{2}):(.*)$/, "gm");
        const mainDataLines = SourceText.matchAll(mainDataFieldFinder);

        const MainDataFields: Set<BMSMainDefinition> = new Set();

        let countOfMeasures: number = -Infinity;

        for (const L of mainDataLines) {

            const m = Number(L[1]);
            const c = Number(L[2]);
            const i = String(L[3]);

            MainDataFields.add(
                {
                    measure: m,
                    channel: c,
                    //2文字づつに分割
                    indexes: i.match(/.{2}/g) || []
                }
            );

            if (countOfMeasures < m) {
                countOfMeasures = m;
            };
        }

        return [MainDataFields, countOfMeasures];
    }

    public scanner(MainDataFields: Set<BMSMainDefinition>, countOfMeasures: number) {

        //空のmeasureで埋める。もっといい書き方があるかも
        const measures: Measure[] = Array(countOfMeasures + 1)
            .fill(null)
            .map(() => ({
                beginTime: 0,
                notePositions: new Map(),
            }));

        for (const dataField of MainDataFields) {

            const indexes = dataField.indexes;

            if (!isConvertibleKeyChannel(dataField.channel)) {
                console.warn("data field channel has UnConvertible KeyChannel");
                continue;
            }

            if (!BMSChannelToKeyStatement.get(dataField.channel)) {
                throw new Error("BMSChannelToKeyStatement returned an invalid value. chartConfig may be incorrect.");
            }

            const beat = this.quarterNote / indexes.length;

            for (let i = 0; i < indexes.length; i = i + 1) {

                if (indexes[i] === "00") {
                    continue;
                }

                measures[dataField.measure].notePositions.set(i * beat, BMSChannelToKeyStatement.get(dataField.channel)! /* FIX ME */);
            }

        }

        this.measures = measures;
        console.info(measures);
    }
}