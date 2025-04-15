// このファイルはRenderの外部から直接インポートせず、TomoyoRender.tsからインポートする事を推奨

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;