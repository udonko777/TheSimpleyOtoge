export = {}

type Judge = {
    name:string;
    score:number;
    damage:number;
    isCuttingCombo:boolean;
}

declare global {
    var startClock:any;
}