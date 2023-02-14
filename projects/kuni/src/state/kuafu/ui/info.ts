import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Game from "ts@/kuni/lib/core";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";
import { TransformAncientDate, Throtte } from "ts@/kuni/lib/utils/common";
import KuaFu from "../kuafu";

class GameUiInfo extends KnGroup {
  public game: Game;
  public options: any;
  public parent: KuaFu;
  public gameDate: any; // 游戏日期单位
  public dayStamp: number = 0; // 日计时
  public season: number; // 季节数值
  public weather: number; // 天气数值
  public wealth: number = 500; // 财富
  public day: number = 0; // 日期（number）
  public month: number = 0; // 月份（number）
  public year: number = 0; // 年份（number）
  public wealthText: KnText; // 财富文本
  public dayText: KnText; // 日期文本
  public monthText: KnText; // 月份文本
  public yearText: KnText; // 年份文本

  constructor(game: Game, parent: KuaFu, options?: any) {
    super(game, "gameInfo", parent);
    this.gameDate = this.game.loader.resources.date.data;
    this.game = game;
    this.options = options;
    this.addWealth();
    this.addDatePanel();
    this.parent = parent;
  }

  // 添加财富面板
  addWealth() {
    this.wealthText = this.game.add.text(
      "",
      this.wealth + "",
      {
        fontSize: 30,
        fill: 0x999999,
        strokeThickness: 10,
        stroke: 0xffffff
      },
      [0.5, 0.5]
    );
    this.addChild(this.wealthText);
    this.wealthText.position.set(this.game.config.half_w, 160);
  }

  // 添加日期面板
  addDatePanel() {
    const dateStyle = {
      fontSize: 32,
      fill: 0xd10311,
      strokeThickness: 10,
      stroke: 0xffffff
    };

    const { year, month, day } = this.getDateString();
    this.yearText = this.game.add.text("", year, dateStyle, [0.5, 0.5]);
    this.monthText = this.game.add.text("", month, dateStyle, [0.5, 0.5]);
    this.dayText = this.game.add.text("", day, dateStyle, [0.5, 0.5]);

    this.add([this.yearText, this.monthText, this.dayText], true);
    this.yearText.position.set(this.game.config.half_w - 150, 300);
    this.monthText.position.set(this.game.config.half_w, 300);
    this.dayText.position.set(this.game.config.half_w + 150, 300);
  }

  // 更新数据
  update() {
    Throtte(0.8, 1, () => {
      this.dateJumping();
    });
    this.wealthJumping();
  }

  getDateString() {
    // 获取日期数字类型
    const resArr = TransformAncientDate.transform(this.dayStamp);

    // 获取日期文字类型
    const resStrArr = TransformAncientDate.toString(this.gameDate, resArr);

    return {
      year: resStrArr[0],
      month: resStrArr[1],
      day: resStrArr[2],
      numArr: resArr
    };
  }

  // 年月变化比较
  compareYM(numArr) {
    const flags = [numArr[0] !== this.year, numArr[1] !== this.month];
    this.year = numArr[0];
    this.month = numArr[1];
    return flags;
  }

  // 日期跳转
  dateJumping() {
    this.dayStamp += 1;

    const { day, month, year, numArr } = this.getDateString();
    const compareArr = this.compareYM(numArr);
    this.game.add.scrollText(day, this.dayText, 0, this.parent.tween);
    compareArr[0] &&
      this.game.add.scrollText(year, this.yearText, 0.2, this.parent.tween);
    compareArr[1] &&
      this.game.add.scrollText(month, this.monthText, 0.4, this.parent.tween);

    // 获取季节数据
    let [seasonType] = TransformAncientDate.getSeason(this.gameDate, numArr[1]);
    this.season = seasonType;

    // 获取天气数据
    // console.log(TransformAncientDate.getWeather(this.gameDate, numArr[1]));
  }

  // 金额跳转
  wealthJumping() {
    this.game.add.jumpingNumber(this.wealthText, {
      plusedVal: this.wealth,
      interval: 4
    });
  }
}

export default GameUiInfo;
