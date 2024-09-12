/*
 * @Author: kunnisser
 * @Date: 2024-02-28 09:50:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-09-12 17:48:01
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/temp/scene.ts
 * @Description: ---- 临时文件 ----
 */
import { InteractionEvent } from "pixi.js";
import Game from "ts@/kuni/lib/core";
import KnPanel from "ts@/kuni/lib/gameobjects/kn_panel";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnModal from "ts@/kuni/lib/gameui/kn_modal";
import { rem } from "ts@/kuni/lib/utils/common";

class Temp extends KnScene {
  game: Game;
  modal: KnModal;
  restart: any;
  cardContainer: KnPanel;
  turnPoints: any;
  laser: import("/Users/qiankun/cams/kunigame/projects/kuni/lib/gameobjects/kn_graphics").default;
  shoot: boolean;
  pos: PIXI.Point;
  startPoint: PIXI.Point;
  laserTexture: any;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      bg: "assets/images/bg.png",
      menu: "assets/images/waterPlanet.png",
      panelTitle: "assets/images/modalTitle.png",
      panelBg: "assets/images/tempBg.png",
      score: "assets/images/score.png",
      close: "assets/images/close.png",
      restart: "assets/images/restart.png",
      laser: "assets/images/hp_inner_bar.png",
      beams: "assets/images/beams.png",
      star: "assets/images/star.png"
    };
    this.turnPoints = [];
    this.shoot = false;
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background("bg", "bg");
    this.addChild(gameBg);
    // this.cardContainer = this.game.add.panel("testCard", this);
    // this.cardContainer.background = this.game.add.sprite("panelBg", "panelBg");
    // const fillColor = 0x6c5d53;
    // this.cardContainer.setPosition(
    //   this.game.config.half_w,
    //   this.game.config.half_h
    // );
    // this.cardContainer.setPadding(rem(40));
    // const icon = this.game.add.sprite("score", "score", [0, 0.5]);
    // const text4 = this.game.add.text(
    //   "weaponPart",
    //   "破碎的法杖碎片",
    //   {
    //     fontSize: rem(40),
    //     fill: fillColor,
    //     fontWeight: 800
    //   },
    //   [0, 0.5]
    // );
    // this.cardContainer.point.y += icon.height * 0.5;
    // this.cardContainer.addRow([icon], "left", 0);
    // this.cardContainer.addRow([text4], "left", rem(20));
    // const text1 = this.game.add.text(
    //   "tmpText",
    //   "默认技能：躲避单次技能或者普通伤害并强化累加到下一次普攻伤害，最高叠加3层（30%触发）",
    //   {
    //     fontSize: rem(28),
    //     fill: fillColor,
    //     wordWrap: true,
    //     wordWrapWidth: this.cardContainer.maxWidth,
    //     lineHeight: rem(50),
    //     breakWords: true
    //   },
    //   [0, 0]
    // );
    // this.cardContainer.addColumn([text1], "left", icon.height * 0.75);

    this.startPoint = this.game.add.pointer(100, 100);
    // const endPoint = this.game.add.pointer(400, 500);

    this.laser = this.game.add.graphics();
    this.laserTexture = PIXI.utils.TextureCache["beams"];
    this.laserTexture.orig.height *= 1 / this.game.dpr;

    console.log(this.laserTexture, this.game.dpr);

    // const tween = this.game.add.tween();
    // tween.instance.to(this.laser, 0.15, {
    //   alpha: 0.6,
    //   ease: tween.bounce.easeInOut,
    //   yoyo: true,
    //   repeat: -1
    // });
    // laser.endFill();
    // laser.rotation = angle;

    const star = this.game.add.sprite("star", "star", [0.5, 0.5]);
    star.position.set(this.startPoint.x, this.startPoint.y);
    this.addChild(this.laser);

    gameBg.interactive = true;
    gameBg.on("pointerdown", (event: InteractionEvent) => {
      this.pos = event.data.getLocalPosition(this.game.currentScene);
      this.shoot = true;
      this.laser.clear();
      const dx = this.pos.x - this.startPoint.x;
      const dy = this.pos.y - this.startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      console.log(dy, dx);
      const rotate = Math.atan2(dy, dx);
      const matrix = new PIXI.Matrix();
      matrix.rotate(rotate); // 旋转矩阵
      console.log(this.laserTexture.orig.height);
      // this.laser.beginTextureFill({
      //   texture: this.laserTexture
      // });
      // this.laser.drawRect(0, -15, distance, 30);
      this.laser.position.set(100, 100);
      this.laser.lineTextureStyle({
        width: 30,
        texture: this.laserTexture,
        alignment: 0
      });

      this.laser.moveTo(this.startPoint.x, this.startPoint.y);
      // for (let i = 1; i < 4; i++) {
      //   const rx =
      //     this.startPoint.x +
      //     math.realInRange(dx * i - distance, dx * i + distance);
      //   const ry =
      //     this.startPoint.y +
      //     math.realInRange(dy * i - distance, dy * i + distance);
      //   this.laser.lineTo(rx, ry);
      // }
      this.laser.lineTo(this.pos.x, this.startPoint.y);
    });

    gameBg.on("pointermove", (event: InteractionEvent) => {
      this.pos = event.data.getLocalPosition(this.game.currentScene);
    });

    gameBg.on("pointerup", (event: InteractionEvent) => {
      // this.laser.clear();
      this.shoot = false;
    });

    // const options = [
    //   {
    //     key: "menu",
    //     name: "富甲天下",
    //     callback: () => {
    //       this.modal.showPanel()
    //     }
    //   },
    //   {
    //     key: "menu",
    //     name: "先知",
    //     callback: () => {
    //       this.modal.showPanel()
    //     }
    //   },
    //   {
    //     key: "menu",
    //     name: "段正淳",
    //     callback: () => {
    //       console.log("段段小鸡鸡");
    //     }
    //   },
    //   {
    //     key: "menu",
    //     name: "排行榜"
    //   },
    //   {
    //     key: "menu",
    //     name: "我服"
    //   }
    // ];
    // const scrollMenu = new KnScrollMenu(this.game, this, options, !0, 1.6);
    // const bgRect = this.game.add
    //   .graphics()
    //   .generateRect(
    //     0xd10311,
    //     [0, 0, this.game.config.width, rem(300)],
    //     !0
    //   );
    // const menuBg = TransformImage.transformToSprite(
    //   this.game,
    //   bgRect,
    //   scrollMenu
    // );
    // menuBg.alpha = 1;
    // menuBg.anchor.set(0.5);
    // scrollMenu.position.set(this.game.config.half_w, this.game.config.height - menuBg.height * 0.5);
    // scrollMenu.initial(menuBg);
    // this.addModal();
  }

  addModal() {
    const options = {
      type: "scroll",
      modalBg: "panelBg",
      titleBg: "panelTitle",
      close: "close",
      maskCloseAble: false,
      panels: [
        {
          title: "游戏失败",
          build: this.addInfo
        }
      ]
    };
    this.modal = new KnModal(this.game, this, options);
    console.log(this.modal);
  }

  addInfo = (modal) => {
    this.restart = this.game.add.button(
      "restart",
      "restart",
      null,
      modal.content,
      [0.5, 0.5]
    );
    this.restart.position.set(
      modal.overlay.width * 0.5,
      modal.overlay.height * 0.5
    );

    const score = this.game.add.image("", "score", modal.content);
    score.y = modal.overlay.height * 0.81;
    const scoreTitle = this.game.add.section(
      "历史最高",
      "100",
      rem(30),
      modal.content,
      {
        padding: [rem(40), rem(10)],
        bg: 0xe5b240,
        border: rem(20),
        space: rem(20)
      }
    );
    scoreTitle.position.set(
      score.width + rem(30),
      score.y + (score.height - scoreTitle.height) * 0.5
    );
    // const size = 24;
    // const attack = this.game.add.section("攻击力", "50-120", size, modal.content, {
    //   padding: 6,
    //   bg: 0x00a6cc
    // });
  };

  update() {
    if (this.shoot) {
    }
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Temp;
