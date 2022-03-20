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
var falltime;

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

//自分自身を一度呼び出す関数っす。
(function () {

}());

//HTML側Bodyのonlordに書かれているので、この関数はBodyの読み込みが終わったら呼ばれるはず
function startClock() {
    IntervID = window.setInterval(frame, 25);
}

//ここに、一フレームにつき行う動作を描く
function frame() {
    clock = new Date();
    //画面のリフレッシュ
    ctx.clearRect(0, 0, 3000, 3000);
    ctx.fillStyle = 'rgb( 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb( 0, 255, 0)';
    ctx.fillRect(0, 500, canvas.width, 5);
    //譜面生成(要改善)
    /*
    var R = Math.floor(Math.random() * 90);
    if (R < 4 && notes.length < 10000) { notes.push(new Note(canvas, ctx, R, 12)); }
    */

    notes.push(new Note(canvas, ctx, 0, -3000, 1));
    notes.push(new Note(canvas, ctx, 0, -3000, 2));
    notes.push(new Note(canvas, ctx, 0, -3000, 3));
    notes.push(new Note(canvas, ctx, 0, -3000, 4));
    notes.push(new Note(canvas, ctx, 0, -3000, 8));

    //存在するすべてのNoteオブジェクトの時を進める
    for (let i = 0; i < notes.length; i++) {
        notes[i].writenote();
    }
    //console.log((clock.getTime() - starttime) / 100);
}

function keypressed(e) {
    //console.log(e.key);
    if (e.code == 'KeyJ') {
        //console.log("maybe j is plassed,thanks watching this console log,");
        console.log(notes[2].falltime + (clock.getTime() - starttime));
        judgeTiming(2);
    }
    return false;
}

function judgeTiming(l) {
    //bは短縮のためのインスタンスな変数です。
    let b = (notes[2].falltime + (clock.getTime() - starttime))

    console.log(`${l}is plass, i think it is${b}`);

    if (300 > b && -300 < b) {
        console.log("parfect");
    }

    return false;
}