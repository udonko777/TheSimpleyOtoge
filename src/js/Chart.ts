export type BMSMainDefinition = {
    /** 000 ~ 999 に収まる、何小節目かを表す数字*/
    measure: number,
    /** 00 ~ 99 */
    channel: number;
    /** 2文字の36進数の連続 */
    indexes: string;
}

export class Chart {

    FILE_TYPE: string = "BMS";

    readonly MainDataField: Set<BMSMainDefinition>

    constructor(SourceText: string){

        // [小節][チャンネル]:[定義]
        const mainDataFieldFinder = new RegExp(/#(\d{3})(\d{2}):(.*)$/, "gm");
        const mainDataLines = SourceText.matchAll(mainDataFieldFinder);

        const MainDataField: Set<BMSMainDefinition> = new Set();

        for (const L of mainDataLines) {
            MainDataField.add(
                {
                    measure: Number(L[1]),
                    channel: Number(L[2]),
                    indexes: String(L[3])
                }
            )
        }

        this.MainDataField = MainDataField;

    }
}