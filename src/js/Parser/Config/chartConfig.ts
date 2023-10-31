
export type ConvertibleKeyChannel = 11 | 13 | 15 | 19;

/** 
 * BMS形式での定義チャンネルをローカルな形式に変換する。
 */
export const BMSChannelToKeyStatement: Map<ConvertibleKeyChannel, number> = new Map(
    [
        [11, 1],
        [13, 2],
        [15, 3],
        [19, 4]
    ]
)

export function isConvertibleKeyChannel(value: number): value is ConvertibleKeyChannel {

    return [11,13,15,19].includes(value);

} 