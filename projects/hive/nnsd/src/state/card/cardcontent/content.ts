/*
 * @Author: kunnisser
 * @Date: 2024-02-02 16:06:12
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-29 22:40:47
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\cardcontent\content.ts
 * @Description: ---- 卡牌内容 ----
 */

import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import CheckerCardWrap from '../checkerboard/checkerCard';
import Game from 'ts@/kuni/lib/core';
import KnSprite from 'ts@/kuni/lib/gameobjects/kn_sprite';
import * as dragonBones from '../module/dragonbones.min.js';
import KnBitMapText from 'ts@/kuni/lib/gameobjects/kn_bitmap_text';
import Card from '../scene';

class CardContent extends KnGroup {
  game: Game;
  parent: CheckerCardWrap;
  attribute: string; // 卡牌属性
  race: string; // 卡牌种族
  sprite: KnSprite;
  indices: Array<number>; // 卡牌系坐标
  hp: KnBitMapText; // 卡牌血量文字
  hpValue: number; // 卡牌血量数值
  attack: KnBitMapText; // 卡牌攻击力文字
  attackValue: number; // 卡牌攻击力数值
  hpWrap: KnSprite; // 卡牌生命值图标
  emitContainer: KnGroup; // 卡牌的粒子容器，储存粒子发射器
  constructor(game: Game, parent: KnGroup, card: CheckerCardWrap) {
    super(game, 'cardContent', parent);
    this.game = game;
    this.parent = card;
    this.race = '';
    this.attribute = '';
    this.sprite = game.add.sprite('default_content', 'content_empty');
    this.indices = [0, 0];
  }

  // 初始化
  initial() {}

  // 初始化粒子容器
  initialParticle() {
    this.emitContainer = this.game.add.group('particleEmitter', this);
  }
  // 卡牌点击事件
  onClick() {}

  // 设置内部角色
  setRole(bonesKey: string, bonesName: string) {
    const loader = this.game.loader;
    const DB: any = dragonBones.default;
    const factory: any = DB.PixiFactory.factory;
    factory.parseDragonBonesData(loader.resources[bonesKey + 'Ske'].data);
    factory.parseTextureAtlasData(
      loader.resources[bonesKey + 'Data'].data,
      PIXI.utils.TextureCache[bonesKey]
    );
    const sprite: any = factory.buildArmatureDisplay(bonesName);
    this.addChild(sprite);
    return sprite;
  }

  // 设置卡牌血量
  setHealth(val: number) {
    this.hpValue = val;
    this.hpWrap = this.game.add.image('health', 'health', this, [0.5, 0.5]);
    this.hpWrap.scale.set(0.8);
    this.hp = this.game.add.bitmapText(
      'hp',
      val + '',
      {
        fontName: 'font_a',
        fontSize: 50,
      },
      [0.5, 0.5]
    );
    this.hp.position.set(
      this.parent.wrap.width * 0.5 - 50,
      -this.parent.wrap.height * 0.5 + 50
    );
    this.hpWrap.position.set(this.hp.x, this.hp.y);
    this.addChild(this.hpWrap, this.hp);
  }

  // 设置卡牌攻击力
  setAttack(val: number) {
    this.attackValue = val;
    this.attack = this.game.add.bitmapText(
      'attack',
      val + '',
      {
        fontName: 'font_b',
        fontSize: 50,
      },
      [0.5, 0.5]
    );
    this.attack.position.set(
      -this.parent.wrap.width * 0.5 + 25,
      this.parent.wrap.height * 0.5 - 25
    );
    this.addChild(this.attack);
  }

  // 击败其他卡牌的逻辑
  defeat(target: CheckerCardWrap, direct: string) {}

  // 卡牌触发事件
  event(target: CardContent, scene: Card) {}

  // 设置粒子发射器
  setParticleEmitter(emitter) {
    this.emitContainer.removeChildren();
    this.emitContainer.addChild(emitter);
  }
}

export default CardContent;
