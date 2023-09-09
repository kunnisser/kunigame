/*
 * @Author: kunnisser
 * @Date: 2021-02-26 14:50:22
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-09-10 01:07:43
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\start\scene.ts
 * @Description: ---- 示例欢迎场景 ----
 */
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import Game from 'ts@/kuni/lib/core';
import KnText from 'ts@/kuni/lib/gameobjects/kn_text';

class Start extends KnScene {
  game: Game;
  demoTest: KnText;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      attack: 'assets/images/attack.png',
      logo: 'assets/images/logo.png',
      avator_01: 'assets/images/avator_01.png',
      loadingrun: 'assets/atlas/loadingrun.json',
      icon: 'assets/atlas/icon.json',
      rocket: 'assets/images/rocket.png',
      gas: "assets/images/gas.png"
    };
  }

  boot() {}

  create() {
    const testGroup = this.game.add.group('group1');
    const group2 = this.game.add.group('group2', this);
    const demoText: KnText = this.game.add.text('demoText', 'test1', {
      fontSize: '24',
      fill: 0xffffff
    }, [0.5, 0.5]);
    demoText.scale.x = 4.1;
    demoText.angle = 46.739919993534755;
    demoText.text = '充电桩';
    demoText.anchor.set(0.5, 0.5);
    demoText.y = 239;
    demoText.x = 452;
    const demo1Text: KnText = this.game.add.text('demo1Text', 'test2', {
      fontSize: '24',
      fill: 0xffffff
    }, [0.5, 0.5]);
    demo1Text.text = '配发';
    demo1Text.y = 239;
    demo1Text.x = 1406.3786101926257;
    const demo2Text: KnText = this.game.add.text('demo2Text', 'test3', {
      fontSize: '24',
      fill: 0xffffff
    }, [0.5, 0.5]);
    demo2Text.text = '特斯拉';
    demo2Text.visible = true;
    demo2Text.y = 239;
    demo2Text.x = 1766.3786101926257;
    testGroup.addChild(demoText);
    testGroup.addChild(demo1Text);
    testGroup.addChild(demo2Text);
    this.game.add.group('groupChild', group2);
    const logo2 = this.game.add.image('logo2', 'logo', group2);
    logo2.scale.y = 1;
    logo2.scale.set(1.0300000000000002, 1.2524539231364777);
    logo2.angle = 0;
    logo2.alpha = 1;
    logo2.visible = true;
    logo2.anchor.set(0.5, 0.5);
    logo2.y = 239;
    logo2.x = 348;
    logo2.scale.x = 1;
    logo2.tintColor = '#ffffff';
    this.addChild(testGroup);
    const rocket = this.game.add.image('rocketTemp', 'rocket', this);
    rocket.position.set(this.game.config.half_w, this.game.config.half_h);
    rocket.anchor.set(0.5);
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