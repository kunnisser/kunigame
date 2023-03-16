/*
 * @Author: kunnisser
 * @Date: 2019-08-31 15:01:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-02-07 16:11:14
 */

import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import Game from "ts@/kuni/lib/core";
import { TransformImage } from "ts@/kuni/lib/utils/common";

class Home extends KnScene {
  public loadingTypes: Map<string, Function>;
  public loadingGp: PIXI.Container;
  public autoDisplay: Boolean;
  public clouds: Array<PIXI.Sprite>;
  public textPixels: Array<Object>;
  bg: PIXI.Sprite;
  drawStage: KnGraphics;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.clouds = [];
    this.resources = {
      "bg002": "/projects/kuni/assets/images/bg002.jpg"
    };
  }

  boot() {
    // this.create();
  }

  create() {
    this.generateBackground();
    this.initClouds();
    this.initText();
  }

  generateBackground() {
    const bg = this.game.add.image("bg002", this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
  }

  initClouds() {
    this.clouds = [];
    let limit = 565;
    const radius = 2;
    const drawStage = this.game.add.graphics();
    while (limit > 0) {
      limit--;
      const color = +this.returnColor();
      drawStage.beginFill(color);
      drawStage.drawCircle(0, 0, radius);
      drawStage.endFill();
      const cloudBit = TransformImage.transformToSprite(
        this.game,
        drawStage,
        this
      );
      cloudBit.anchor.set(0.5);
      cloudBit.x = cloudBit["targetX"] =
        (this.game.config.width - 2 * radius) * Math.random() + radius;
      cloudBit.y = cloudBit["targetY"] =
        (this.game.config.height - 2 * radius) * Math.random() + radius;
      cloudBit.alpha = 0.5;
      this.clouds.push(cloudBit);
    }
  }

  returnColor() {
    let [color, index] = ["0x", 0];
    let colorArr = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f"
    ];
    while (index < 6) {
      color += colorArr[Math.floor(Math.random() * colorArr.length)];
      index++;
    }
    return color;
  }

  initText() {
    let currentText = new PIXI.Text("凌晨帆", {
      fontFamily: "Arial",
      fontSize: 120,
      fill: 0xffffff,
      fontWeight: "bold",
      align: "center"
    });
    currentText.position.set(this.game.config.half_w, this.game.config.half_h);
    currentText.anchor.set(0.5);
    currentText.alpha = 0;
    this.addChild(currentText);

    // 通过extract的pixels方法获取text对象的坐标组
    const textData = this.game.app.renderer.plugins.extract.pixels(currentText);
    this.textPixels = [];
    let interval = 4;
    for (let i = textData.length; i >= 0; i -= interval) {
      if (textData[i] !== 0) {
        let x = (i / interval) % currentText.width;
        let y = Math.floor(Math.floor(i / currentText.width) / interval);

        // 粒子密度，每6颗取一个粒子
        if (x && x % 6 === 0 && y && y % 6 === 0) {
          this.textPixels.push({
            x,
            y
          });
        }
      }
    }
    this.textPixels.forEach((o, i) => {
      if (this.clouds[i]) {
        this.clouds[i]["targetX"] =
          o["x"] + this.game.config.half_w - currentText.width * 0.5;
        this.clouds[i]["targetY"] =
          o["y"] + this.game.config.half_h - currentText.height * 0.5;
        this.clouds[i]["targetV"] = Math.random() * 0.05 + 0.05;
        this.clouds[i]["targetA"] = 1;
      }
    });
  }

  update() {
    for (let c of this.clouds) {
      if (c.position.x !== c["targetX"]) {
        c.position.x += c["targetV"] * (c["targetX"] - c.position.x);
      }
      if (c.position.y !== c["targetY"]) {
        c.position.y += c["targetV"] * (c["targetY"] - c.position.y);
      }
      if (c.alpha !== c["targetA"]) {
        c.alpha += c["targetV"] * (c["targetA"] - c.alpha);
      }
    }
  }
}

export default Home;
