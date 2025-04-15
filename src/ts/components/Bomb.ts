import { Box, makeBox } from "../Render/TomoyoRender";
import { GraphicRequestHandler } from "../Render/Component";

/**
 * ユーザーが対応するキーを押した際に、そのキーが押されたことを強調するアニメーション
 */
export class Bomb implements GraphicRequestHandler {
  private readonly no: number;
  private bombLife: number;
  private readonly NOTE_WIDTH: number;

  /**
   * @param no 左から何番目のレーンに表示するか、0から始まる
   * @param bombLife 爆弾の表示時間(フレーム)、0になると消える
   * @param NOTE_WIDTH 横幅を指定する、基本的にはノーツの横幅と同じにする
   */
  constructor(no: number, bombLife: number, NOTE_WIDTH: number) {
    this.no = no;
    this.bombLife = bombLife;
    this.NOTE_WIDTH = NOTE_WIDTH;
  }

  public draw() {
    if (this.bombLife > 0) {
      const x = this.no * this.NOTE_WIDTH;
      const y = 480 + this.bombLife / 4;

      const bombGraphic: Box = makeBox(
        x,
        y,
        this.NOTE_WIDTH,
        5,
        `rgba( 100, 105, 200, ${this.bombLife / 50})`,
      );

      this.bombLife -= 1;
      return bombGraphic;
    }
  }

  public setBombLife(bombLife: number): void {
    this.bombLife = bombLife;
  }
}
