import { bmsChannelToKeyStatement, isConvertibleKeyChannel } from "./Config/chartConfig"

/** tokenizeされたBMS定義の1行 */
type BMSMainDefinition = {
    /** 000 ~ 999 に収まる、何小節目かを表す数字 */
    readonly measuresIndex: number,
    /** 00 ~ 99 */
    readonly channel: number;
    /** 2文字の36進数の連続 */
    readonly notesPositions: ReadonlyArray<string>;
}

type Measure = {
    /** その小節が始まる時刻(ms) */
    beginTime: number;
    /** 落ちてくるタイミング 降ってくる場所 */
    notePositions: Map<number, number>;
}

type ChartTokens<T> = readonly [
    tokens: ReadonlyArray<T>,
    countOfMeasures: number
]

type ChartTokenizer<T> = (sourceText: string) => ChartTokens<T>;
type ChartTokenScanner<T> = (tokens: ChartTokens<T>) => ReadonlyArray<Measure>;

//TODO とりあえず手打ちで
const BPM: number = 145;

/** 全音符1回が対応する時間(ms) 実際はBPMの変化があるため、mutableな値になる */
const quarterNote: number = 240000 / BPM;

/**
 * テキストから譜面データを読み込む
 * @param sourceText BMS形式の譜面テキスト。
 */
export const parse = (sourceText: string): void => {
    const tokens = bmsTokenizer(sourceText);
    bmsScanner(tokens);
}

const getBMSMainDefinition = (measuresIndex: number, channel: number, notesPositions: ReadonlyArray<string> = []): BMSMainDefinition => {

    if (measuresIndex < 0 || measuresIndex > 999) {
        console.error('measuresIndex must be between 0 and 999.');
    }

    if (channel < 0 || channel > 99) {
        console.error('channel must be between 0 and 99.');
    }

    return {
        measuresIndex,
        channel,
        notesPositions,
    };

}

const bmsTokenizer: ChartTokenizer<BMSMainDefinition> = (sourceText) => {
    // [小節][チャンネル]:[定義]
    const mainDataFieldFinder = new RegExp(/#(\d{3})(\d{2}):(.*)$/, "gm");
    const mainDataLines = sourceText.matchAll(mainDataFieldFinder);

    const mainDataFields: BMSMainDefinition[] = [];

    let countOfMeasures: number = 0;

    for (const L of mainDataLines) {

        const measuresIndex = Number(L[1]);
        const channel = Number(L[2]);
        const notesPositions = String(L[3]).match(/.{2}/g) ?? []; //2文字づつに分割

        //省略された分の小節を空の小節として書き加える
        for (let i = 0; (i + mainDataFields.length) < measuresIndex; i++) {
            mainDataFields.push(
                getBMSMainDefinition(i + mainDataFields.length, 0)
            )
        }

        mainDataFields.push(
            {
                measuresIndex,
                channel,
                notesPositions
            }
        );

        if (countOfMeasures < measuresIndex) {
            countOfMeasures = measuresIndex;
        }
    }

    return [mainDataFields, countOfMeasures];
}

const bmsScanner: ChartTokenScanner<BMSMainDefinition> = ([mainDataFields, countOfMeasures]) => {

    //小節の集合の初期化
    //空のmeasureで埋める。もっといい書き方があるかも
    const measures: Measure[] = Array(countOfMeasures + 1)
        .fill(null)
        .map(() => ({
            beginTime: 0,
            notePositions: new Map<number, number>()
        }));

    //定義されていない分、例えば空白の小節について対応する定義があるとは限らない。
    for (const [i, measure] of measures.entries()) {
        measure.beginTime = i * quarterNote;
    }

    //定義を元に小節にノーツを置いていく
    for (const dataField of mainDataFields) {

        const channel = dataField.channel;
        const positions = dataField.notesPositions;
        const measuresIndex = dataField.measuresIndex;

        if (!isConvertibleKeyChannel(channel)) {
            //かなりの量のlogが出るので、基本無効にしてある
            //console.warn(`data field channel ${channel} is UnConvertible KeyChannel`);
            continue;
        }

        if (!bmsChannelToKeyStatement.has(channel)) {
            throw new Error("BMSChannelToKeyStatement returned an invalid value. chartConfig may be incorrect.");
        }

        const beat = quarterNote / positions.length;

        //一行のうち、全ての音符について
        for (const [i, position] of positions.entries()) {

            if (position === "00") {
                continue;
            }

            measures[measuresIndex]
                .notePositions
                .set(
                    i * beat,
                    bmsChannelToKeyStatement.get(channel)! /* FIX ME */
                );
        }

    }
    console.info(measures);

    return measures;
}