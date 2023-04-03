/*
 * @Author: kunnisser
 * @Date: 2020-12-03 10:17:56
 * @LastEditors: kunnisser
 * @LastEditTime: 2022-09-06 11:14:54
 * @FilePath: /kunigame/projects/kuni/src/state/postion/index.ts
 * @Description: ---- 三点加权质心定位算法 ----
 */

import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";

class Triangulation extends KnScene {
  public game: Game;
  public shootType: number;
  public tween: any;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {};
  }

  boot() {}

  create() {
    this.tween = this.game.add.tween();
    this.addBackground();
    let r1 = 80 + Math.random() * 100;
    let r2 = 40 + Math.random() * 100;
    let r3 = 200 + Math.random() * 100;
    let point1 = {
      x: 600,
      y: 400
    };
    let point2 = {
      x: 300,
      y: 650
    };
    let point3 = {
      x: 500,
      y: 400
    };
    let c1 = this.game.add
      .graphics()
      .generateLineCircle(0xd10311, [point1.x, point1.y, r1]);
    let c2 = this.game.add
      .graphics()
      .generateLineCircle(0xe8a91a, [point2.x, point2.y, r2]);
    let c3 = this.game.add
      .graphics()
      .generateLineCircle(0x1a73e8, [point3.x, point3.y, r3]);

    this.addChild(c1);
    this.addChild(c2);
    this.addChild(c3);

    let retPoint1 = this.computedPointer(r1, r2, point1, point2, point3);
    let retPoint2 = this.computedPointer(r1, r3, point1, point3, point2);
    let retPoint3 = this.computedPointer(r2, r3, point2, point3, point1);
    // 质心加权
    let x =
      (retPoint1.x / (r1 + r2) +
        retPoint2.x / (r1 + r3) +
        retPoint3.x / (r2 + r3)) /
      (1 / (r1 + r2) + 1 / (r1 + r3) + 1 / (r2 + r3));
    let y =
      (retPoint1.y / (r1 + r2) +
        retPoint2.y / (r1 + r3) +
        retPoint3.y / (r2 + r3)) /
      (1 / (r1 + r2) + 1 / (r1 + r3) + 1 / (r2 + r3));
    // 绘制定位点
    let pos = this.game.add.graphics().generateCircle(0x1ae846, [x, y, 8]);
    this.addChild(pos);
    console.log("定位坐标 x: " + x, "y: " + y);

    // 优化的三点质心加权
    let x1 =
      (retPoint1.x * (1 / r1 + 1 / Math.pow(r2, r1 / r2)) +
        retPoint2.x * (1 / Math.pow(r2, r1 / r2) + 1 / Math.pow(r3, r1 / r3)) +
        retPoint3.x * (1 / r1 + 1 / Math.pow(r3, r1 / r3))) /
      (2 * (1 / r1 + 1 / Math.pow(r2, r1 / r2) + 1 / Math.pow(r3, r1 / r3)));
    let y1 =
      (retPoint1.y * (1 / r1 + 1 / Math.pow(r2, r1 / r2)) +
        retPoint2.y * (1 / Math.pow(r2, r1 / r2) + 1 / Math.pow(r3, r1 / r3)) +
        retPoint3.y * (1 / r1 + 1 / Math.pow(r3, r1 / r3))) /
      (2 * (1 / r1 + 1 / Math.pow(r2, r1 / r2) + 1 / Math.pow(r3, r1 / r3)));
    let pos1 = this.game.add.graphics().generateCircle(0xb51ae8, [x1, y1, 8]);
    this.addChild(pos1);
    console.log("定位坐标2 x: " + x1, "y: " + y1);
  }

  computedPointer(r1, r2, p1, p2, rest) {
    let AB: number = Math.sqrt(
      Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
    );
    console.log(AB);

    if (AB < r1 + r2 && Math.abs(r1 - r2) < AB) {
      console.log("相交");
      let AE: number =
        (Math.pow(r2, 2) - Math.pow(r1, 2) - Math.pow(AB, 2)) / (-2 * AB);
      console.log(AE);
      let CE: number = Math.sqrt(Math.pow(r1, 2) - Math.pow(AE, 2));
      console.log(CE);
      let flag = p1.x - p2.x > 0 ? -1 : 1;
      let pointE = {
        x: p1.x + ((p2.x - p1.x) * AE) / AB,
        y: p1.y + ((p2.y - p1.y) * AE) / AB
      };
      console.log(pointE);
      let angle = Math.asin((p2.y - p1.y) / AB);
      console.log(angle);
      let pointC = {
        x: pointE.x + flag * Math.sin(angle) * CE,
        y: pointE.y - Math.cos(angle) * CE
      };
      console.log(pointC);
      let pointD = {
        x: pointE.x - flag * Math.sin(angle) * CE,
        y: pointE.y + Math.cos(angle) * CE
      };

      let restPointC =
        Math.abs(pointC.x - rest.x) + Math.abs(pointC.y - rest.y);
      let restPointD =
        Math.abs(pointD.x - rest.x) + Math.abs(pointD.y - rest.y);

      if (restPointC > restPointD) {
        let pd = this.game.add
          .graphics()
          .generateCircle(0xffffff, [pointD.x, pointD.y, 6]);
        this.addChild(pd);
        return pointD;
      } else {
        // 绘制相交点
        let pc = this.game.add
          .graphics()
          .generateCircle(0xffffff, [pointC.x, pointC.y, 6]);
        this.addChild(pc);
        return pointC;
      }
    } else if (AB == r1 + r2) {
      console.log("相切");
      let AE: number =
        (Math.pow(r2, 2) - Math.pow(r1, 2) - Math.pow(AB, 2)) / (-2 * AB);
      let pointE = {
        x: p1.x + ((p2.x - p1.x) * AE) / AB,
        y: p1.y + ((p2.y - p1.y) * AE) / AB
      };
      console.log(pointE);
      // 绘制相交点
      let pe = this.game.add
        .graphics()
        .generateCircle(0xffffff, [pointE.x, pointE.y, 6]);
      this.addChild(pe);
      return pointE;
    } else if (AB > r1 + r2) {
      console.log("相离");
      let disX = p2.x - p1.x;
      let disY = p2.y - p1.y;

      let pointE = {
        x: p1.x + (((AB + r1 - r2) * 0.5) / AB) * disX,
        y: p1.y + (((AB + r1 - r2) * 0.5) / AB) * disY
      };
      console.log(pointE);

      // 绘制相交点
      let pe = this.game.add
        .graphics()
        .generateCircle(0xffffff, [pointE.x, pointE.y, 6]);
      this.addChild(pe);
      return pointE;
    } else {
      console.log("内含");
      let disX = p2.x - p1.x;
      let disY = p2.y - p1.y;
      let pointE = {
        x: p1.x + ((r1 + r2 + AB) * 0.5 * disX) / AB,
        y: p1.y + ((r1 + r2 + AB) * 0.5 * disY) / AB
      };
      console.log(pointE);

      // 绘制相交点
      let pe = this.game.add
        .graphics()
        .generateCircle(0xffffff, [pointE.x, pointE.y, 6]);
      this.addChild(pe);
      return pointE;
    }
  }

  addBackground() {
    // const bg = this.game.add.image("",'wsjBg', this);
    // bg.width = this.game.config.width;
    // bg.height = this.game.config.height;
  }

  reset() {
    if (this.children.length > 1) {
      // 清除group子对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Triangulation;
