

import { ComboView } from "./js/components/ComboView";

import { Note } from "./js/components/Note";

import { JudgeView } from "./js/components/JudgeView";

import { Bomb } from "./js/UI/Bomb";
//@ts-expect-error
import { MusicPlayer } from "./js/MusicPlayer.mjs";

import { GrooveGauge } from "./js/Gauges/GrooveGauge";

import { TomoyoRender } from "./TomoyoRender";

import bmeFile from "./resource/demo/darksamba/_dark_sambaland_a.bme";

//import {JUDGES} from '/jsons/judge.json' 

//HTML側Bodyのonlordに書かれているので、この関数はBodyの読み込みが終わったら呼ばれるはず
window.startClock = () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const game = new Game(canvas);
}

class Game {

    CTX: CanvasRenderingContext2D;

    keypresscount: number;

    judgeview: JudgeView;
    conboView: ComboView;

    readonly CANVAS_HEIGHT: number;
    readonly CANVAS_WIDTH: number;

    notes: Note[];
    bombs: Bomb[];

    render: TomoyoRender;

    startGame: (e: KeyboardEvent) => void;
    GAUGE: any;

    keypressed!: (e: KeyboardEvent) => void;

    exitMain: any;

    /** Game開始のための準備、いろいろ読み込んでstartGameを可能にする。*/
    constructor(canvas: HTMLCanvasElement) {

        this.CANVAS_HEIGHT = canvas.height;
        this.CANVAS_WIDTH = canvas.width;

        /** @readonly */
        this.CTX = canvas.getContext('2d') as CanvasRenderingContext2D;

        if (!this.CTX) {
            throw new Error('canvas?');
        }

        this.keypresscount = 0;

        this.render = new TomoyoRender(this.CTX);

        this.judgeview = new JudgeView(this.render);
        this.conboView = new ComboView(this.render);

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

        /** @type {Array.<Bomb>} */
        this.bombs = [];

        for (let i = 0; i < 4; i++) {
            this.bombs.push(new Bomb(this.render, i, 0, NOTE_WIDTH));
        }

        this.startGame = (e) => { this._startGame(e) };
        document.addEventListener('keydown', this.startGame);

        //ゲームが実際に起動されるまで表示される待ち受け画面。
        this.inputWaitingscreen();
    }

    //実際にゲームが始まるタイミングで呼ばれる
    _startGame(e: KeyboardEvent) {

        /** @type {Object.<Judge>} */
        // JUDGES

        this.GAUGE = new GrooveGauge(this.render);

        document.removeEventListener('keydown', this.startGame);

        //ノーツの開始地点を記録
        //TODO performance.nowが使えなければDate.nowを取得
        const NOW = performance.now();
        this.notes.forEach(note => note.begin(NOW));

        this.keypressed = (e) => { this._keypressed(e) };
        document.addEventListener('keydown', this.keypressed);

        const musicplayer = new MusicPlayer();
        musicplayer.play();

        this.frame();

    }

    //gameが実際に始まる前までに表示し続ける表示
    inputWaitingscreen() {

        this.writeBackGround();

        this.render.drawText("キーボード押すと音が鳴るよ", 50, 100, "21px serif", 'rgb( 255, 102, 102)');
        this.render.drawText("爆音なので注意", 50, 120, "21px serif", 'rgb( 255, 102, 102)');

    }

    //再帰的なメインループ
    frame = () => {

        //window.cancelAnimationFrame(this.exitMain)でメインループを抜けられる
        this.exitMain = window.requestAnimationFrame(this.frame);

        const NOW = performance.now();

        //画面のリフレッシュ
        this.CTX.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        this.writeBackGround();

        this.GAUGE.draw();

        this.bombs.forEach(bomb => bomb.writebomb())

        this.judgeview.draw();
        this.conboView.draw();

        //存在するすべてのNoteオブジェクトの時を進める

        for (let i = 0; i < this.notes.length; i++) {
            this.notes[i].draw(NOW);
            if (this.notes[i].isOVER(NOW)) {
                this.judgeview.judge = "OVER";
                this.GAUGE.judge = "OVER";
                this.conboView.resetConboCount();
                this.notes.splice(i, 1);
            };
        }

    }

    writeBackGround() {
        this.render.drawBox(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT, 'rgb( 0, 0, 0)');

        //判定位置生成
        this.render.drawBox(0, 502, this.CANVAS_WIDTH, 5, 'rgb( 0, 255, 0)');
    }

    //何らかのキーが押されている時呼ばれます
    _keypressed(e: KeyboardEvent) {

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
        this.keypresscount += 1;
        return false;
    }

    judgeTiming(l: number) {

        //TODO クッソ雑に全ノーツを判定します。

        for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].no === l) {

                //bは短縮のためのインスタンスな変数です。

                const b = this.notes[i].falltime + (globalThis.performance.now() - this.notes[i].getSTART_TIME())

                if (50 > b && -50 < b) {
                    console.log(`${l}is GREAT!, i think it is${b}`);
                    this.judgeview.judge = "GREAT";
                    this.GAUGE.judge = "GREAT";
                    this.conboView.addConboCount();
                    this.notes.splice(i, 1);
                } else if (100 > b && -100 < b) {
                    this.judgeview.judge = "GOOD";
                    this.GAUGE.judge = "GOOD";
                    this.conboView.addConboCount();
                    this.notes.splice(i, 1);
                } else if (200 > b && -200 < b) {
                    this.judgeview.judge = "bad";
                    this.GAUGE.judge = "BAD";
                    this.conboView.resetConboCount();
                    this.notes.splice(i, 1);
                } else if (210 > b && -210 < b) {
                    this.judgeview.judge = "POOR";
                    this.notes.splice(i, 1);
                }

            }

        }

        this.bombs[l].setbomblife(50);

        return;
    }

}