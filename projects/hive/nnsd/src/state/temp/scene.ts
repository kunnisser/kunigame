/*
 * @Author: kunnisser
 * @Date: 2024-02-28 09:50:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-29 17:26:05
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/temp/scene.ts
 * @Description: ---- 临时文件 ----
 */
import Game from "ts@/kuni/lib/core";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnModal from "ts@/kuni/lib/gameui/kn_modal";
import KnScrollMenu from "ts@/kuni/lib/gameui/kn_scrollMenu";
import { TransformImage, rem } from "ts@/kuni/lib/utils/common";

class Temp extends KnScene {
  game: Game;
  modal: KnModal;
  restart: any;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      "bg": 'assets/images/bg.png',
      "menu": "assets/images/waterPlanet.png",
      "panelTitle": "assets/images/modalTitle.png",
      "panelBg": "assets/images/panelBg.png",
      "score": "assets/images/score.png",
      "close": "assets/images/close.png",
      "restart": "assets/images/restart.png"
    };
  }

  boot() { }

  create() {
    const gameBg = this.game.add.background('bg', 'bg');
    this.addChild(gameBg);
    const options = [
      {
        key: "menu",
        name: "富甲天下",
        callback: () => {
          this.modal.showPanel()
        }
      },
      {
        key: "menu",
        name: "先知",
        callback: () => {
          this.modal.showPanel()
        }
      },
      {
        key: "menu",
        name: "段正淳",
        callback: () => {
          console.log("段段小鸡鸡");
        }
      },
      {
        key: "menu",
        name: "排行榜"
      },
      {
        key: "menu",
        name: "我服"
      }
    ];
    const scrollMenu = new KnScrollMenu(this.game, this, options, !0, 1.6);
    const bgRect = this.game.add
      .graphics()
      .generateRect(
        0xd10311,
        [0, 0, this.game.config.width, rem(300)],
        !0
      );
    const menuBg = TransformImage.transformToSprite(
      this.game,
      bgRect,
      scrollMenu
    );
    menuBg.alpha = 1;
    menuBg.anchor.set(0.5);
    scrollMenu.position.set(this.game.config.half_w, this.game.config.height - menuBg.height * 0.5);
    scrollMenu.initial(menuBg);
    this.addModal();
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
    this.restart.position.set(modal.overlay.width * 0.5, modal.overlay.height * 0.5);

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

  update() { }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Temp;
