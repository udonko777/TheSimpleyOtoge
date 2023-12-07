import { ComboView } from "./js/components/ComboView";

import { Note } from "./js/components/Note";

import { JudgeView } from "./js/components/JudgeView";

import { Bomb } from "./js/components/Bomb";

import { MusicPlayer } from "./js/MusicPlayer";

import { GrooveGauge } from "./js/Gauges/GrooveGauge";

import { TomoyoRender } from "./TomoyoRender";

import { BMSParser } from "./js/Parser/Chart";

import bmeFile from "./resource/demo/darksamba/_dark_sambaland_a.bme";

import { BackGround } from "./js/components/BackGround";

import { BarLine } from "./js/components/BarLine";

//import {JUDGES} from '/jsons/judge.json' 

//HTML側BodyのonLordに書かれているので、この関数はBodyの読み込みが終わったら呼ばれるはず
window.startClock = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const game = new Game(canvas);
}

export class Game {

    keyPressCount: number;

    judgeView: JudgeView;
    conboView: ComboView;

    backGround: BackGround;
    barLine: BarLine;

    notes: Note[];
    bombs: Bomb[];

    render: TomoyoRender;

    startGame: (e: KeyboardEvent) => void;
    GAUGE: any;

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

        this.render = new TomoyoRender(canvas);

        this.judgeView = new JudgeView(this.render);
        this.conboView = new ComboView(this.render);

        this.backGround = new BackGround(this.render, canvas.height, canvas.width);
        this.barLine = new BarLine(this.render, 2, canvas.width, 4448, 120);

        const BMEChart = new BMSParser().parse(bmeFile);

        console.info(BMEChart);

        this.notes = [];

        // 譜面をもとに、ノーツを配置する

        // まずChartPurserとTextSplitterを実体化する
        // TextSplitterにimportしたファイルを渡して、帰ってきたものをChartPurserに渡す
        // Notesが帰ってくる。NotesはNoteの集合を表現するクラス。

        const NOTE_WIDTH = 80;

        for (let i = 0; i < 4000; i++) {
            this.notes.push(new Note(this.render, (i + 1) % 4, 4448 + (278 * i), 1, NOTE_WIDTH, 120));
            this.notes.push(new Note(this.render, (i + 2) % 4, 4448 + (278 * i), 1, NOTE_WIDTH, 120));
            this.notes.push(new Note(this.render, (i + 3) % 4, 4448 + (278 * i), 1, NOTE_WIDTH, 120));
        }

        this.bombs = [];

        for (let i = 0; i < 4; i++) {
            this.bombs.push(new Bomb(this.render, i, 0, NOTE_WIDTH));
        }

        this.startGame = (e) => { this._startGame(e) };
        document.addEventListener('keydown', this.startGame);

        //ゲームが実際に起動されるまで表示される待ち受け画面。
        this.inputWaitingScreen();
    }

    //実際にゲームが始まるタイミングで呼ばれる
    private _startGame(e: KeyboardEvent) {

        this.GAUGE = new GrooveGauge(this.render);

        document.removeEventListener('keydown', this.startGame);

        //ノーツの開始地点を記録
        //TODO performance.nowが使えなければDate.nowを取得
        const NOW = performance.now();
        this.notes.forEach(note => note.begin(NOW));

        this.barLine.begin(NOW);

        //アロー関数にしなくてもいいかも？静的な参照を持ちたい
        document.addEventListener('keydown', (e) => { this._keyPressed(e) });

        const musicPlayer = new MusicPlayer();
        musicPlayer.play();

        this.frame();

    }

    //gameが実際に始まる前までに表示し続ける表示
    private inputWaitingScreen() {

        this.backGround.draw();

        this.render.drawText("キーボード押すと音が鳴るよ", 50, 100, "21px serif", 'rgb( 255, 102, 102)');
        this.render.drawText("爆音なので注意", 50, 120, "21px serif", 'rgb( 255, 102, 102)');

    }

    //再帰的なメインループ
    private frame = () => {

        //window.cancelAnimationFrame(this.exitMain)でメインループを抜けられる
        this.exitMain = window.requestAnimationFrame(this.frame);

        const NOW = performance.now();

        //画面のリフレッシュ
        this.render.clear();

        //FIX 更新があってもなくても毎フレームリサイズしている。 canvasサイズの変更を受け取るハンドラから呼び出すべき
        this.backGround.setSize(this.canvasHeight(), this.canvasWidth());
        this.backGround.draw();

        this.barLine.setSize(this.canvasWidth());

        this.GAUGE.draw();

        this.bombs.forEach(bomb => bomb.draw());

        this.judgeView.draw();
        this.conboView.draw();

        this.barLine.draw(NOW);

        //存在するすべてのNoteオブジェクトの時を進める

        for (let i = 0; i < this.notes.length; i++) {
            this.notes[i].draw(NOW);
            if (this.notes[i].isOVER(NOW)) {
                this.judgeView.judge = "OVER";
                this.GAUGE.judge = "OVER";
                this.conboView.resetConboCount();
                this.notes.splice(i, 1);
            };
        }

    }

    //何らかのキーが押されている時呼ばれます
    private _keyPressed(e: KeyboardEvent) {

        console.log(e.key);
        if (e.repeat === false) {
            if (e.code === 'KeyD') {
                this.judgeTiming(0);
            } else if (e.code === 'KeyF') {
                this.judgeTiming(1);
            } else if (e.code === 'KeyJ') {
                this.judgeTiming(2);
            } else if (e.code === 'KeyK') {
                this.judgeTiming(3);
            }
        }
        this.keyPressCount += 1;
        return false;
    }

    private judgeTiming(l: number) : void {

        //TODO クッソ雑に全ノーツを判定します。

        for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].no === l) {

                //bは短縮のためのインスタンスな変数です。

                const b = (globalThis.performance.now() - this.notes[i].getSTART_TIME()) - this.notes[i].perfectTiming;

                if (50 > b && -50 < b) {
                    console.log(`${l}is GREAT!, i think it is${b}`);
                    this.judgeView.judge = "GREAT";
                    this.GAUGE.judge = "GREAT";
                    this.conboView.addConboCount();
                    this.notes.splice(i, 1);
                } else if (100 > b && -100 < b) {
                    this.judgeView.judge = "GOOD";
                    this.GAUGE.judge = "GOOD";
                    this.conboView.addConboCount();
                    this.notes.splice(i, 1);
                } else if (200 > b && -200 < b) {
                    this.judgeView.judge = "bad";
                    this.GAUGE.judge = "BAD";
                    this.conboView.resetConboCount();
                    this.notes.splice(i, 1);
                } else if (210 > b && -210 < b) {
                    this.judgeView.judge = "POOR";
                    this.notes.splice(i, 1);
                }

            }

        }

        this.bombs[l].setBombLife(50);

        return;
    }

}