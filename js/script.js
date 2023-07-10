'use strict';

import { ComboView } from "./components/ComboView.mjs";
import { Note } from "./components/Note.mjs";
import { JudgeView } from "./components/JudgeView.mjs";

import { Bomb } from "./UI/Bomb.mjs";

import { Gauge } from "./Gauge.mjs";
import { MusicPlayer } from "./MusicPlayer";


/** TODO: ゲージのUIの実装とゲージの計算を同じ場所で行っている激ヤバClass、早く何とかする。
 * 
 */
class GrooveGauge extends Gauge {

    constructor(ctx) {
        super(ctx);

        this.groove = 22220;
        this.GAUGE_BOX_NUMBER = 24;

        this.GAUGE_BOX_AS_GROOVE = this.MAXGROOVE / this.GAUGE_BOX_NUMBER;

        this.GREAT = 1000;
        this.GOOD = 100;
        this.BAD = -1200;
        this.OVER = -2000;
    }

    boxcolor(no) {
        const enableBoxNumber = Math.floor(this.groove / this.GAUGE_BOX_AS_GROOVE);

        if (no < enableBoxNumber) {
            return '#3ad132';
        } else {
            return '#444444';
        }
    }

    /** ジャッジの名前からゲージの増減を計算する。ジャッジをオブジェクトにすればこんなことしなくていいと思う。
     * @param {string} judgeName
     */
    set judge(judgeName) {
        switch (judgeName) {
            case "PGREAT":
                this.groove += this.PGREAT;
                break;
            case "GREAT":
                this.groove += this.GREAT;
                break;
            case "GOOD":
                this.groove += this.GOOD;
                break;
            case "BAD":
                this.groove += this.BAD;
                break;
            case "POOR":
                this.groove += this.POOR;
                break;
            case "OVER":
                this.groove += this.OVER;
                break;
            case "BREAK":
                this.groove += this.BREAK;
                break;

            default:
                console.log("i dont know this judgeName");
                break;
        }

        //this.grooveを0 ~ MAXGROOVEに成型する
        this.groove = Math.max(this.groove, 0);

        this.groove = Math.min(this.groove, this.MAXGROOVE);
    }
}

//HTML側Bodyのonlordに書かれているので、この関数はBodyの読み込みが終わったら呼ばれるはず
globalThis.startClock = () => {
    const canvas = /** @type HTMLCanvasElement */ (document.getElementById('canvas'));
    const game = new Game(canvas);
}

class Game {

    /** Game開始のための準備、いろいろ読み込んでstartGameを可能にする。
     * @param {CanvasRenderingContext2D?} canvas
     */
    constructor(canvas) {

        /** @readonly */
        this.CANVAS = canvas;

        /** @readonly */
        this.CTX = canvas?.getContext('2d');

        if(!this.CTX){
            throw new Error('canvas?');
        }

        this.keypresscount = 0;

        this.judgeview = new JudgeView(this.CTX);
        this.conboView = new ComboView(this.CTX);

        this.notes = [];

        //譜面をもとに、ノーツを配置する

        const NOTE_WIDTH = 80;

        for (let i = 0; i < 4000; i++) {
            this.notes.push(new Note(this.CTX, (i + 1) % 4, 4448 + (278 * i), 1, NOTE_WIDTH, 120));
            this.notes.push(new Note(this.CTX, (i + 2) % 4, 4448 + (278 * i), 1, NOTE_WIDTH, 120));
            this.notes.push(new Note(this.CTX, (i + 3) % 4, 4448 + (278 * i), 1, NOTE_WIDTH, 120));
        }

        /** @type {Array.<Bomb>} */
        this.bombs = [];

        for (let i = 0; i < 4; i++) {
            this.bombs.push(new Bomb(this.CTX, i, 0, NOTE_WIDTH));
        }

        this.startGame = (e) => { this._startGame(e) };
        document.addEventListener('keydown', this.startGame);

        //ゲームが実際に起動されるまで表示される待ち受け画面。
        this.inputWaitingscreen();
    }

    //実際にゲームが始まるタイミングで呼ばれる
    _startGame(e) {

        //TODO paformance.now()使ったほうが高精度。でも変更の範囲が広いから覚悟して編集すること。
        this.clock = new Date();

        this.GAUGE = new GrooveGauge(this.CTX);

        document.removeEventListener('keydown', this.startGame);

        //FIX noteの数が増えてくるとどんどんずれる原因になる・・・かも。

        const NOTES_LENGTH = this.notes.length;

        for (let i = 0; i < NOTES_LENGTH; i++) {
            this.notes[i].begin(this.clock.getTime());
        }

        this.keypressed = (e) => { this._keypressed(e) };
        document.addEventListener('keydown', this.keypressed);

        const musicplayer = new MusicPlayer();
        musicplayer.play();

        this.frame();

    }

    //gameが実際に始まる前までに表示し続ける表示
    inputWaitingscreen() {

        this.writeBackGround();

        this.CTX.fillStyle = 'rgb( 255, 102, 102)';
        this.CTX.font = "18px serif";
        
        this.CTX.fillText("キーボード押すと音が鳴るよ", 50, 100);
        this.CTX.fillText("爆音なので注意", 50, 120);
    }

    //再帰的なメインループ
    frame = () => {

        //window.cancelAnimationFrame(this.exitMain)でメインループを抜けられる
        this.exitMain = window.requestAnimationFrame(this.frame);

        this.clock = new Date();

        //画面のリフレッシュ
        this.CTX.clearRect(0, 0, 3000, 3000);

        this.writeBackGround();

        this.GAUGE.draw();

        this.bombs.forEach(bomb => bomb.writebomb())

        this.judgeview.draw();
        this.conboView.draw();

        //存在するすべてのNoteオブジェクトの時を進める

        for (let i = 0; i < this.notes.length; i++) {
            this.notes[i].draw(this.clock);
            if (this.notes[i].isOVER(this.clock)) {
                this.judgeview.judge = "OVER";
                this.GAUGE.judge = "OVER";
                this.conboView.resetConboCount();
                this.notes.splice(i, 1);
            };
        }

    }

    writeBackGround() {
        this.CTX.fillStyle = 'rgb( 0, 0, 0)';
        this.CTX.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);
        //判定位置生成
        this.CTX.fillStyle = 'rgb( 0, 255, 0)';
        this.CTX.fillRect(0, 502, this.CANVAS.width, 5);
    }

    //何らかのキーが押されている時呼ばれます
    _keypressed(e) {

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

    /** @param {Number} l */
    judgeTiming(l) {

        //TODO クッソ雑に全ノーツを判定します。

        for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].no === l) {

                //bは短縮のためのインスタンスな変数です。

                const b = this.notes[i].falltime + (this.clock.getTime() - this.notes[i].getSTART_TIME())

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