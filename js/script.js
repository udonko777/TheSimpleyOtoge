// Enable the passage of the 'this' object through the JavaScript timers

var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;

window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeSI__(vCallback instanceof Function ? function () {
        vCallback.apply(oThis, aArgs);
    } : vCallback, nDelay);
};

//ここグローバルになってるので可能ならスコープを狭めたいっす。
let IntervID;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//bomの描画関連。雑な実装なのでどうにかしたい。
var bomb = [];
var judgeview;
var comboview;

class Note {

    constructor(canvas, ctx, no, falltime, hispeed, NOTE_WIDTH, START_TIME) {

        this.canvas = canvas;
        this.ctx = ctx;
        this.no = no;
        this.hispeed = hispeed;
        this.NOTE_WIDTH = NOTE_WIDTH;
        this.START_TIME = START_TIME;
        this.falltime = falltime;
        //(落ちるまでの時間 + 現在の時間 - 開始時間) / ハイスピ + 判定位置
        //このタイミングで現在の時間と開始時間が等しいので0
        this.y = ((falltime + 0) / hispeed) + 500;
    }

    writenote(clock) {

        //ノーツの色の設定
        this.ctx.fillStyle = '#DD7070';

        this.y = ((this.falltime + clock.getTime() - this.START_TIME) / this.hispeed) + 500;
        //ノーツの描画
        this.ctx.fillRect(this.no * this.NOTE_WIDTH, this.y, this.NOTE_WIDTH, 10);
        //console.log(this.y);
    }

    isOVER(clock) {
        //無視された時の処理(OVER判定)

        if (501 < this.falltime + (clock.getTime() - this.START_TIME)) {
            return true;
        }
        else {
            return false;
        }
    }
}

class Bomb {

    constructor(ctx, no, bomblife, NOTE_WIDTH) {
        this.bomblife = bomblife;
        this.ctx = ctx;
        this.no = no;
        this.NOTE_WIDTH = NOTE_WIDTH;
    }

    writebomb() {
        if (this.bomblife > 0) {
            this.ctx.fillStyle = `rgba( 100, 105, 200,${this.bomblife / 50})`;
            this.ctx.fillRect(this.no * this.NOTE_WIDTH, 480 + (this.bomblife / 4), this.NOTE_WIDTH, 5);
            this.bomblife -= 1;
        } else {

        }
        return false;
    }

    setbomblife(bomblife) {
        this.bomblife = bomblife;
    }
}

class JudgeView {

    constructor(ctx) {
        //judge == {N/A,poor,poor,good,great,great}
        this.ctx = ctx;
        this.judgeName = "N/A";
        this.x = 70;
        this.y = 370;
    }

    /**
     * @param {String} judgeName
     */
    set judge(judgeName) {
        switch (judgeName) {
            case "OVER":
                this.judgeName = "OVER";
                break;
            case "POOR":
                this.judgeName = "POOR";
                break;
            case "BAD":
                this.judgeName = "BAD";
                break;
            case "GOOD":
                this.judgeName = "GOOD";
                break;
            case "GREAT":
                this.judgeName = "GREAT";
                break;
            default:
                console.log("i dont know this judgeName");
                break;
        }
    }

    writejudge() {
        switch (this.judgeName) {
            case "N/A":
                break
            case "OVER":
                this.ctx.fillStyle = 'rgb( 255, 102, 102)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("POOR", this.x, this.y);
                break
            case "POOR":
                this.ctx.fillStyle = 'rgb( 255, 102, 102)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("POOR", this.x, this.y);
                break
            case "BAD":
                this.ctx.fillStyle = 'rgb( 255, 102, 102)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("BAD", this.x, this.y);
                break
            case "GOOD":
                this.ctx.fillStyle = 'rgb( 255, 128, 0)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("GOOD", this.x, this.y);
                break
            case "GREAT":
                this.ctx.fillStyle = 'rgb( 0, 128, 255)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("GREAT", this.x, this.y);
                break
        }
    }
}

class ComboView {

    constructor(ctx) {
        this.ctx = ctx;
        this.combocount = 0;
    }

    addConboCount() {
        this.combocount += 1;
    }

    resetConboCount() {
        this.combocount = 0;
    }

    writeConboCount() {
        if (this.combocount > 0) {
            this.ctx.fillStyle = 'rgb( 255, 102, 102)';
            this.ctx.font = "48px serif";
            this.ctx.fillText(this.combocount, 10, 100);
        } else {
            console.log("comboocunt is zero");
        }
    }
}

class GrooveGauge {

}

//自分自身を一度呼び出す関数っす。
(function () {

}());

//HTML側Bodyのonlordに書かれているので、この関数はBodyの読み込みが終わったら呼ばれるはず
function startClock() {

    let notes = [];
    let clock = new Date();

    const START_TIME = clock.getTime();
    const NOTE_WIDTH = 80;

    for (i = 1; i < 70; i++) {
        notes.push(new Note(canvas, ctx, (i + 1) % 4, -3000 - (1000 * i), i, NOTE_WIDTH, START_TIME));
        notes.push(new Note(canvas, ctx, (i + 2) % 4, -3000 - (1000 * i), i, NOTE_WIDTH, START_TIME));
        notes.push(new Note(canvas, ctx, (i + 3) % 4, -3000 - (1000 * i), i, NOTE_WIDTH, START_TIME));
    }


    for (let i = 0; i < 4; i++) {
        bomb.push(new Bomb(ctx, i, 0, NOTE_WIDTH));
    }

    const game = new Game(notes, clock, START_TIME);
}

class Game {

    constructor(notes, clock, START_TIME) {
        this.notes = notes;
        this.clock = clock;
        this.START_TIME = START_TIME;

        judgeview = new JudgeView(ctx);
        comboview = new ComboView(ctx);

        this.keypressed = (e) => { this._keypressed(e) };
        document.addEventListener('keydown', this.keypressed);

        this.IntervID = window.setInterval(this.frame.bind(this), 4);
    }

    //ここに、一フレームにつき行う動作を描く
    frame() {
        this.clock = new Date();
        //画面のリフレッシュ
        ctx.clearRect(0, 0, 3000, 3000);
        //背景生成
        ctx.fillStyle = 'rgb( 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //判定位置生成
        ctx.fillStyle = 'rgb( 0, 255, 0)';
        ctx.fillRect(0, 502, canvas.width, 5);

        //ボム生成
        for (let i = 0; i < bomb.length; i++) {
            bomb[i].writebomb();
        }

        //判定表示
        judgeview.writejudge();
        comboview.writeConboCount();

        //存在するすべてのNoteオブジェクトの時を進める
        for (let i = 0; i < this.notes.length; i++) {
            this.notes[i].writenote(this.clock);
            if (this.notes[i].isOVER(this.clock)) {
                judgeview.judge = "OVER";
                comboview.resetConboCount();
                this.notes.splice(i, 1);
            };
        }

        //console.log((clock.getTime() - starttime) / 100);
    }

    //何らかのキーが押されている時呼ばれます
    _keypressed(e) {
        console.log(e.key);
        //console.log(e.key);
        if (e.repeat == false) {
            if (e.code == 'KeyD') {
                //console.log("d is plassed,");
                this.judgeTiming(0);
            } else if (e.code == 'KeyF') {
                //console.log("f is plassed,");
                this.judgeTiming(1);
            } else if (e.code == 'KeyJ') {
                //console.log("j is plassed,");
                this.judgeTiming(2);
            } else if (e.code == 'KeyK') {
                //console.log("k is plassed,");
                this.judgeTiming(3);
            }
        }
        return false;
    }
    /** @param {Number} l */
    judgeTiming(l) {

        //クッソ雑に全ノーツを判定します。todo。

        for (let i = 0; i < this.notes.length; i++) {
            console.log(i);
            if (this.notes[i].no == l) {

                //bは短縮のためのインスタンスな変数です。

                let b = (this.notes[i].falltime + (this.clock.getTime() - this.START_TIME))

                console.log(`${l}is plass, i think it is${b}`);

                if (50 > b && -50 < b) {
                    console.log("GREAT");
                    judgeview.judge = "GREAT";
                    comboview.addConboCount();
                    this.notes.splice(i, 1);
                } else if (300 > b && -300 < b) {
                    console.log("good");
                    judgeview.judge = "GOOD";
                    comboview.addConboCount();
                    this.notes.splice(i, 1);
                } else if (400 > b && -400 < b) {
                    console.log("bad");
                    judgeview.judge = "bad";
                    comboview.resetConboCount();
                    this.notes.splice(i, 1);
                } else if (500 > b && -500 < b) {
                    console.log("poor");
                    judgeview.judge = "POOR";
                    this.notes.splice(i, 1);
                }

            } else { }

        }

        bomb[l].setbomblife(50);

        return false;
    }

}