/*
 * @Author: kunnisser
 * @Date: 2023-02-03 15:09:26
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-14 11:03:36
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/start/scene.ts
 * @Description: ----  ----
 */
/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-26 16:40:24
 * @FilePath: /kunigame/projects/template/src/state/welcome/scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */

import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import Game from "ts@/kuni/lib/core";
import KnText from "ts@/kuni/lib/gameobjects/kn_text";

class Start extends KnScene {
  public game: Game;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resouces = {};
  }

  boot() {}

  create() {
    const demoText: KnText = this.game.add.text(
      "测试文本",
      "Start",
      {
        fontSize: "24",
        fill: 0xffffff
      },
      [0.5, 0.5]
    );
    demoText.position.set(this.game.config.half_w, this.game.config.half_h);
    this.addChild(demoText);
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Start;
