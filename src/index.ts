import { ComboView } from "./js/components/ComboView";

import { Note } from "./js/components/Note";
import { generateNotes } from "./js/components/generateNotes";

import { JudgeView } from "./js/components/JudgeView";

import { Bomb } from "./js/components/Bomb";

import { MusicPlayer } from "./js/MusicPlayer";

//FIX とりあえず動かすためのimport
import { makeText } from "./js/TomoyoRender";

import { parse } from "./js/Parser/parser";

import { Screen } from "./js/components/Screen";

import bmeFile from "./resource/demo/darksamba/_dark_sambaland_a.bme";

import { BackGround } from "./js/components/BackGround";

import { BarLine } from "./js/components/BarLine";

import { Gauge } from "./js/Gauges/Gauge";

//import {JUDGES} from '/jsons/judge.json' 

//HTML側BodyのonLordに書かれているので、この関数はBodyの読み込みが終わったら呼ばれるはず
window.startClock = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    new Game(canvas);
}

export class Game {

    keyPressCount: number;

    judgeView: JudgeView;
    conboView: ComboView;

    backGround: BackGround;
    barLine: BarLine;

    notes: Note[];
    bombs: Bomb[];

    private screen: Screen;

    startGame: (e: KeyboardEvent) => void;
    GAUGE: Gauge | undefined;

    exitMain: number | undefined;

    canvasHeight: () => number;
    canvasWidth: () => number;

    /** Game開始のための準備、いろいろ読み込んでstartGameを可能にする。*/
    constructor(canvas: HTMLCanvasElement) {

        //HACK canvasのサイズは実行中に変化する可能性がある為に、canvasのサイズを動的に入手する手段を持たせている。
        //もっといい方法が思いつけばそれを採用する。
        this.canvasHeight = () => { return canvas.height };
        this.canvasWidth = () => { return canvas.width };

        this.keyPressCount = 0;

        //this.render = new TomoyoRender(canvas);

        this.judgeView = new JudgeView();
        this.conboView = new ComboView();

        this.backGround = new BackGround(canvas.height, canvas.width);
        this.barLine = new BarLine(2, canvas.width, 4448, 120);

        const chart = parse(bmeFile);

        this.notes = generateNotes(chart);

        this.screen = new Screen(canvas);
        this.screen.setComponents(this.backGround, this.judgeView, this.conboView, this.barLine)

        const BOMB_WIDTH = 80
        this.bombs = [];

        for (let i = 0; i < 4; i++) {
            this.bombs.push(new Bomb(i, 0, BOMB_WIDTH));
        }

        this.startGame = () => { this._startGame() };
        document.addEventListener('keydown', this.startGame);

        //ゲームが実際に起動されるまで表示される待ち受け画面。
        this.inputWaitingScreen();
    }

    //実際にゲームが始まるタイミングで呼ばれる
    private _startGame() {

        this.GAUGE = new Gauge();
        this.screen.setComponents(this.GAUGE)

        document.removeEventListener('keydown', this.startGame);

        //ノーツの開始地点を記録
        //TODO performance.nowが使えなければDate.nowを取得
        const NOW = performance.now();

        for (const note of this.notes) {
            note.begin(NOW);
        }

        this.barLine.begin(NOW);

        //アロー関数にしなくてもいいかも？静的な参照を持ちたい
        document.addEventListener('keydown', (e) => { this._keyPressed(e) });

        const musicPlayer = new MusicPlayer();
        musicPlayer.play();

        this.frame();

    }

    //gameが実際に始まる前までに表示し続ける表示
    private inputWaitingScreen() {

        const backGrounds = this.backGround.draw();
        this.screen.directRender(...backGrounds);

        this.screen.directRender(makeText("キーボード押すと音が鳴るよ", 50, 100, "21px serif", 'rgb( 255, 102, 102)'));
        this.screen.directRender(makeText("爆音なので注意", 50, 120, "21px serif", 'rgb( 255, 102, 102)'));

    }

    //再帰的なメインループ
    private frame = () => {

        //window.cancelAnimationFrame(this.exitMain)でメインループを抜けられる
        this.exitMain = window.requestAnimationFrame(this.frame);

        const NOW = performance.now();

        //画面のリフレッシュ
        this.screen.clear();

        //FIX 更新があってもなくても毎フレームリサイズしている。 canvasサイズの変更を受け取るハンドラから呼び出すべき
        this.backGround.setSize(this.canvasHeight(), this.canvasWidth());

        this.barLine.setSize(this.canvasWidth());

        this.screen.draw(NOW);

        for (const bomb of this.bombs) {
            const graph = bomb.draw();
            //FIX 全然nullは許容してなかったけどとりあえず動くようにした
            if (graph != null) {
                this.screen.directRender(graph);
            }
        }


        for (let i = 0; i < this.notes.length; i++) {

            this.screen.directRender(this.notes[i].draw(NOW));

            if (this.notes[i].isOVER(NOW)) {

                this.judgeView.judge = "OVER";
                this.GAUGE?.setJudge("OVER");
                this.conboView.resetConboCount();
                this.notes.splice(i, 1);

            }
        }

    }

    //何らかのキーが押されている時呼ばれます
    private _keyPressed(e: KeyboardEvent): void {

        if (e.repeat) {
            return;
        }

        console.log(e.key);

        switch (e.code) {
            case `KeyD`:
                this.judgeTiming(0);
                break
            case 'KeyF':
                this.judgeTiming(1);
                break
            case 'KeyJ':
                this.judgeTiming(2);
                break
            case 'KeyK':
                this.judgeTiming(3);
                break
        }
        this.keyPressCount += 1;
        return;
    }

    private judgeTiming(laneID: 0 | 1 | 2 | 3): void {

        //TODO クッソ雑に全ノーツを判定します。

        type EZjudge = "GREAT" | "GOOD" | "BAD" | "POOR"
        type conboStrategy = "keep" | "up" | "reset"

        const sendJudge = (judge: EZjudge, howCountUpConbo: conboStrategy = "keep"): void => {

            this.judgeView.judge = judge;
            this.GAUGE?.setJudge(judge);

            switch (howCountUpConbo) {
                case "up":
                    this.conboView.addConboCount();
                    break;
                case "reset":
                    this.conboView.resetConboCount();
                    break;
                case "keep":
                    break
            }

        }

        for (let i = 0; i < this.notes.length; i++) {

            if (this.notes[i].no === laneID) {

                //bは短縮のためのインスタンスな変数です。

                const b = (globalThis.performance.now() - this.notes[i].getSTART_TIME()) - this.notes[i].perfectTiming;

                if (260 > b && -260 < b) {
                    if (50 > b && -50 < b) {
                        console.log(`${laneID}is GREAT!, i think it is${b}`);
                        sendJudge("GREAT", "up")
                    } else if (100 > b && -100 < b) {
                        sendJudge("GOOD", "up")
                    } else if (120 > b && -120 < b) {
                        sendJudge("BAD", "reset")
                    } else if (140 > b && -140 < b) {
                        sendJudge("POOR", "keep");
                    }
                    this.notes.splice(i, 1);
                }

            }

        }

        this.bombs[laneID].setBombLife(50);

        return;
    }

}