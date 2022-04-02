// Enable the passage of the 'this' object through the JavaScript timers

var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;

document.addEventListener('keydown', keypressed);

window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeSI__(vCallback instanceof Function ? function () {
        vCallback.apply(oThis, aArgs);
    } : vCallback, nDelay);
};

//ここグローバルになってるので可能ならスコープを狭めたいっす。
let IntervID;
let notes = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let starttime = new Date().getTime();

//bomの描画関連。雑な実装なのでどうにかしたい。
var bomb = [];
var judgeview;
var comboview;

class Note {

    constructor(canvas, ctx, no, falltime, hispeed) {

        var clock = new Date();
        this.canvas = canvas;
        this.ctx = ctx;
        this.no = no;
        this.hispeed = hispeed;
        this.falltime = falltime;
        //(落ちるまでの時間 + 現在の時間 - 開始時間) / ハイスピ + 判定位置
        this.y = ((falltime + clock.getTime() - starttime) / hispeed) + 500;
    }

    writenote() {
        //ノーツの色の設定
        this.ctx.fillStyle = '#DD7070';

        this.y = ((this.falltime + clock.getTime() - starttime) / this.hispeed) + 500;
        //ノーツの描画
        this.ctx.fillRect(this.no * 52, this.y, 52, 10);;
        //console.log(this.y);
    }

    isOVER() {
        //無視された時の処理(OVER判定)

        if (501 < this.falltime + (clock.getTime() - starttime)) {
            return true;
        }
        else {
            return false;
        }
    }
}

class Bomb {

    constructor(ctx, no, bomblife) {
        this.bomblife = bomblife;
        this.ctx = ctx;
        this.no = no;
    }

    writebomb() {
        if (this.bomblife > 0) {
            this.ctx.fillStyle = `rgba( 100, 105, 200,${this.bomblife / 50})`;
            this.ctx.fillRect(this.no * 52, 480 + (this.bomblife / 4), 52, 5);
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
        let judgeName = "N/A";
    }

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
                this.ctx.fillText("POOR", 10, 50);
                break
            case "POOR":
                this.ctx.fillStyle = 'rgb( 255, 102, 102)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("POOR", 10, 50);
                break
            case "BAD":
                this.ctx.fillStyle = 'rgb( 255, 102, 102)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("BAD", 10, 50);
                break
            case "GOOD":
                this.ctx.fillStyle = 'rgb( 255, 128, 0)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("GOOD", 10, 50);
                break
            case "GREAT":
                this.ctx.fillStyle = 'rgb( 0, 128, 255)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("GREAT", 10, 50);
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

//自分自身を一度呼び出す関数っす。
(function () {

}());

//HTML側Bodyのonlordに書かれているので、この関数はBodyの読み込みが終わったら呼ばれるはず
function startClock() {

    for (i = 1; i < 70; i++) {
        notes.push(new Note(canvas, ctx, (i + 1) % 4, -3000 - (1000 * i), i));
        notes.push(new Note(canvas, ctx, (i + 2) % 4, -3000 - (1000 * i), i));
        notes.push(new Note(canvas, ctx, (i + 3) % 4, -3000 - (1000 * i), i));
    }


    for (let i = 0; i < 4; i++) {
        bomb.push(new Bomb(ctx, i, 0));
    }

    judgeview = new JudgeView(ctx);
    comboview = new ComboView(ctx);

    IntervID = window.setInterval(frame, 4);
}

//ここに、一フレームにつき行う動作を描く
function frame() {
    clock = new Date();
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
    comboview.writeConboCount()

    //存在するすべてのNoteオブジェクトの時を進める
    for (let i = 0; i < notes.length; i++) {
        notes[i].writenote();
        if (notes[i].isOVER()) {
            judgeview.judge = "OVER";
            comboview.resetConboCount();
            notes.splice(i, 1);
        };
    }

    //console.log((clock.getTime() - starttime) / 100);
}

//何らかのキーが押されている時呼ばれます
function keypressed(e) {
    //console.log(e.key);
    if (e.repeat == false) {
        if (e.code == 'KeyD') {
            //console.log("d is plassed,");
            judgeTiming(0);
        } else if (e.code == 'KeyF') {
            //console.log("f is plassed,");
            judgeTiming(1);
        } else if (e.code == 'KeyJ') {
            //console.log("j is plassed,");
            judgeTiming(2);
        } else if (e.code == 'KeyK') {
            //console.log("k is plassed,");
            judgeTiming(3);
        }
    }
    return false;
}

function judgeTiming(l) {

    //クッソ雑に全ノーツを判定します。todo。

    for (let i = 0; i < notes.length; i++) {
        console.log(i);
        if (notes[i].no == l) {

            //bは短縮のためのインスタンスな変数です。

            let b = (notes[i].falltime + (clock.getTime() - starttime))

            console.log(`${l}is plass, i think it is${b}`);

            if (50 > b && -50 < b) {
                console.log("GREAT");
                judgeview.judge = "GREAT";
                comboview.addConboCount();
                notes.splice(i, 1);
            } else if (300 > b && -300 < b) {
                console.log("good");
                judgeview.judge = "GOOD";
                comboview.addConboCount();
                notes.splice(i, 1);
            } else if (400 > b && -400 < b) {
                console.log("bad");
                judgeview.judge = "bad";
                comboview.resetConboCount();
                notes.splice(i, 1);
            } else if (500 > b && -500 < b) {
                console.log("poor");
                judgeview.judge = "POOR";
                notes.splice(i, 1);
            }

        } else { }

    }

    bomb[l].setbomblife(50);

    return false;
}