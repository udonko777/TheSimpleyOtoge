
export type ConvertibleKeyChannel = 11 | 13 | 15 | 19;

/** 
 * BMS形式での定義チャンネルをローカルな形式に変換する。
 */
export const bmsChannelToKeyStatement: Map<ConvertibleKeyChannel, number> = new Map(
    [
        [11, 0],
        [13, 1],
        [15, 2],
        [19, 3]
    ]
)

export function isConvertibleKeyChannel(value: number): value is ConvertibleKeyChannel {

    return [11, 13, 15, 19].includes(value);

} 