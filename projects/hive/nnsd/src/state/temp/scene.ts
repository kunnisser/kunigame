/*
 * @Author: kunnisser
 * @Date: 2024-02-28 09:50:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-28 17:27:06
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/temp/scene.ts
 * @Description: ---- 临时文件 ----
 */
import Game from "ts@/kuni/lib/core";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnModal from "ts@/kuni/lib/gameui/kn_modal";
import KnScrollMenu from "ts@/kuni/lib/gameui/kn_scrollMenu";
import { TransformImage } from "ts@/kuni/lib/utils/common";

class Temp extends KnScene {
  game: Game;
  modal: KnModal;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      "bg": 'assets/images/bg.png',
      "menu": "assets/images/waterPlanet.png",
      "panelBg": "assets/images/cardBg.png",
      "weapon_able": "assets/images/weapon_able.png",
      "close": "assets/images/close.png",
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
        name: "先知"
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
        [0, 0, this.game.config.width, 300],
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
      panels: [
        {
          title: "武器信息",
          build: this.addInfo
        }
      ]
    };
    this.modal = new KnModal(this.game, this, options);
    console.log(this.modal);
  }

  addInfo = (modal) => {
    const thumb = this.game.add.image("", "weapon_able", modal.content);
    const thumbTitle = this.game.add.section(
      "奥布莱恩之剑",
      "",
      30,
      modal.content,
      {
        padding: 10,
        bg: 0xe5b240
      }
    );
    thumb.height = thumbTitle.height;
    thumb.width = thumb.height;
    thumbTitle.position.set(
      thumb.width + 10,
      (thumb.height - thumbTitle.height) * 0.5
    );
    const size = 24;
    const attack = this.game.add.section("攻击力", "50-120", size, modal.content, {
      padding: 6,
      bg: 0x00a6cc
    });
    attack.position.set(thumb.width + 10, thumbTitle.height + 4);
    const defence = this.game.add.section("防御", "300", size, modal.content, {
      padding: 6,
      bg: 0x00a6cc
    });
    defence.position.set(thumb.width + 10, attack.y + attack.height + 4);
    const crit = this.game.add.section("暴击", "14", size, modal.content, {
      padding: 6,
      bg: 0x00a6cc
    });
    crit.position.set(thumb.width + 10, defence.y + defence.height + 4);
    const crit1 = this.game.add.section("暴击", "14", size, modal.content, {
      padding: 6,
      bg: 0x00a6cc
    });
    crit1.position.set(thumb.width + 10, crit.y + crit.height + 4);
    const crit2 = this.game.add.section("暴击", "14", size, modal.content, {
      padding: 6,
      bg: 0x00a6cc
    });
    crit2.position.set(thumb.width + 10, crit1.y + crit1.height + 4);
    const crit3 = this.game.add.section("暴击", "14", size, modal.content, {
      padding: 6,
      bg: 0x00a6cc
    });
    crit3.position.set(thumb.width + 10, crit2.y + crit2.height + 4);
    const crit4 = this.game.add.section("暴击", "14", size, modal.content, {
      padding: 6,
      bg: 0x00a6cc
    });
    crit4.position.set(thumb.width + 10, crit3.y + crit3.height + 4);
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