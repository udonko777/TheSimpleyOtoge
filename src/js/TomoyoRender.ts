type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export type Box = {
    readonly type: `Box`,
    x: number,
    y: number,
    width: number,
    height: number,
    style: Color,
}

export const makeBox = (x: number, y: number, width: number, height: number, style: Color): Box => {
    return {
        type: `Box`,
        x,
        y,
        width,
        height,
        style
    }
}

export type Text = {
    readonly type: `Text`,
    text: string,
    x: number,
    y: number,
    font: string,
    style: Color,
}

export const makeText = (text: string, x: number, y: number, font: string, style: Color): Text => {
    return {
        type: `Text`,
        text,
        x,
        y,
        font,
        style
    }
}

export type renderableObject = Box | Text

export type ScreenModel = Readonly<{
    ctx: CanvasRenderingContext2D;
    canvas_width: number;
    canvas_height: number;
}>

export const draw = (Screen: ScreenModel, graphic: renderableObject) => {
    switch (graphic.type) {
        case "Box":
            drawBox(Screen, graphic);
            break
        case "Text":
            drawText(Screen, graphic);
            break
    }
}

/** `ctx.fillRect`の代わりに用意された描画メソッド */
const drawBox = (Screen: ScreenModel, box: Box) => {
    Screen.ctx.fillStyle = box.style;
    Screen.ctx.fillRect(box.x, box.y, box.width, box.height);
}

/** `ctx.fillText`の代わりに用意された描画メソッド */
const drawText = (Screen: ScreenModel, text: Text) => {
    Screen.ctx.fillStyle = text.style;
    Screen.ctx.font = text.font;
    Screen.ctx.fillText(text.text, text.x, text.y);
}

export const clear = (Screen: ScreenModel) => {
    Screen.ctx.clearRect(0, 0, Screen.canvas_width, Screen.canvas_height);
}