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
var IntervID;
let notes = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let starttime = new Date().getTime();

//bomの描画関連。雑な実装なのでどうにかしたい。
var bomb = [];
var judgeview;

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
        var judgeName = "N/A";
    }

    set judge(judgeName) {
        switch (judgeName) {
            case "POOR":
                this.judgeName = "POOR";
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
            case "POOR":
                this.ctx.fillStyle = 'rgb( 255, 102, 102)';
                this.ctx.font = "48px serif";
                this.ctx.fillText("POOR", 10, 50);
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

//自分自身を一度呼び出す関数っす。
(function () {

}());

//HTML側Bodyのonlordに書かれているので、この関数はBodyの読み込みが終わったら呼ばれるはず
function startClock() {

    notes.push(new Note(canvas, ctx, 0, -3000, 1));
    notes.push(new Note(canvas, ctx, 1, -4000, 2));
    notes.push(new Note(canvas, ctx, 2, -5000, 3));
    notes.push(new Note(canvas, ctx, 3, -6000, 4));
    notes.push(new Note(canvas, ctx, 0, -7000, 8));

    for (let i = 0; i < 4; i++) {
        bomb.push(new Bomb(ctx, i, 0));
    }

    judgeview = new JudgeView(ctx);

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
    ctx.fillRect(0, 500, canvas.width, 5);

    //ボム生成
    for (let i = 0; i < bomb.length; i++) {
        bomb[i].writebomb();
    }

    //判定表示
    judgeview.writejudge();

    //存在するすべてのNoteオブジェクトの時を進める
    for (let i = 0; i < notes.length; i++) {
        notes[i].writenote();
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

        if (notes[i].no == l) {

            //bは短縮のためのインスタンスな変数です。

            let b = (notes[i].falltime + (clock.getTime() - starttime))

            console.log(`${l}is plass, i think it is${b}`);

            if (50 > b && -50 < b) {
                console.log("GREAT");
                judgeview.judge = "GREAT";
                notes.splice(i, 1);
            } else if (300 > b && -300 < b) {
                console.log("good");
                judgeview.judge = "GOOD";
                notes.splice(i, 1);
            } else if (500 > b && -500 < b) {
                console.log("poor");
                judgeview.judge = "POOR";
            }

        } else { }

        bomb[l].setbomblife(50);

        return false;
    }


}
