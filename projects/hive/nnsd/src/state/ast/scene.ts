/*
 * @Author: kunnisser
 * @Date: 2023-03-07 10:12:37
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-03 02:06:46
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\ast\scene.ts
 * @Description: ----  ----
 */
import Game from 'ts@/kuni/lib/core';
import KnScene from 'ts@/kuni/lib/gameobjects/kn_scene';
import KnText from 'ts@/kuni/lib/gameobjects/kn_text';

class AST extends KnScene {
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      icon: '/projects/hive/nnsd/assets/atlas/icon.json',
      logo: '/projects/hive/nnsd/assets/images/logo.png',
      bg002: '/projects/hive/nnsd/assets/images/bg002.jpg',
      attack: '/projects/hive/nnsd/assets/images/attack.png',
      desyrel: '/projects/hive/nnsd/assets/fonts/desyrel.xml'
    };
  }

  boot() {}

  create() {
    const demoText: KnText = this.game.add.text('text1', 'test1', {
      fontSize: '24',
      fill: 0xffffff
    }, [0.5, 0.5]);
    demoText.position.set(this.game.config.half_w, this.game.config.half_h);
    const testGroup = this.game.add.group('group1', this);
    const demo1Text: KnText = this.game.add.text('测试2', 'test2', {
      fontSize: '24',
      fill: 0xffffff
    }, [0.5, 0.5]);
    demo1Text.position.set(300, 400);
    const demo2Text: KnText = this.game.add.text('测试3', 'test3', {
      fontSize: '24',
      fill: 0xffffff
    }, [0.5, 0.5]);
    demo2Text.position.set(400, 400);
    testGroup.addChild(demoText);
    testGroup.addChild(demo1Text);
    testGroup.addChild(demo2Text);
    const group2 = this.game.add.group('group2', this);
    group2.y = 274;
    group2.x = 486;
    this.game.add.group('groupChild', group2);
  }

  update() {}

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }

}

export default AST;