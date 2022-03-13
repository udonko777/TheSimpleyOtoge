// Enable the passage of the 'this' object through the JavaScript timers

var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;

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

    constructor(canvas, ctx, no, falltime) {

        var clock = new Date();
        this.canvas = canvas;
        this.ctx = ctx;
        this.no = no;
        this.falltime = falltime;
        this.y = falltime + ((clock.getTime() - starttime) / 30); //canvasのhighist参照
    }

    writenote() {
        //ノーツの色の設定
        this.ctx.fillStyle = '#DD7070';

        this.y = this.falltime + ((clock.getTime() - starttime) / 30);
        //ノーツの描画
        this.ctx.fillRect(this.no * 52, this.y, 52, 10);;
        console.log(this.y);
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
    //譜面生成(要改善)
    var R = Math.floor(Math.random() * 90);
    if (R < 4 && notes.length < 10000) { notes.push(new Note(canvas, ctx, R, 30)); }
    //存在するすべてのNoteオブジェクトの時を進める
    for (let i = 0; i < notes.length; i++) {
        notes[i].writenote();
    }
    console.log((clock.getTime() - starttime) / 100);
}