type Judge = {
    name:string;
    score:number;
    damage:number;
    isCuttingCombo:boolean;
}

declare var startClock: any;

declare module '*.text' {
    const src: string;
    export default src;
}

declare module '*.bme' {
    const src: string;
    export default src;
}
