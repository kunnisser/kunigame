/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:25 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-11-26 19:43:47
 */

/*
	* KnFactory 是一个快速构建大量公用游戏对象的类
	* 其创建的对象会自动添加到对应的Manager, World或者是自定义组中
	* @class KnFactory
	* @constructor
	* @param {Core} game - 当前运行的游戏实例的引用	
*/

import KnGroup from 'ts@/lib/gameobjects/kn_group';
import KnGraphics from 'ts@/lib/gameobjects/kn_graphics';
import KnText from 'ts@/lib/gameobjects/kn_text';
import KnEmitter from 'ts@/lib/gameobjects/kn_emitter';
import KnTiling from 'ts@/lib/gameui/kn_tiling';
import Game from 'ts@/lib/core';
import { TransformImage } from 'ts@/lib/utils/common';
import { knTweenLine, KnTween } from 'ts@/lib/gameobjects/kn_tween';
import { Sprite, Texture, AnimatedSprite, utils, Ticker } from 'pixi.js';

class KnFactory {
  public game: Game;
  constructor(game: Game) {
    this.game = game;
  }

  group(key: string, parent: PIXI.Container) {
    return new KnGroup(this.game, key, parent);
  }

  image = (key: any, parent: PIXI.Container, align?: Array<number>) => {
    const texture = Object.prototype.toString.call(key) === '[object String]' ? utils.TextureCache[key] : key;
    const sprite = new Sprite(texture);
    align && sprite.anchor.set(...align);
    parent || (parent = this.game.world);
    return parent.addChild(sprite), sprite;
  }

  button = (key: any, switchKey: any, parent: PIXI.Container, align?: Array<number>, tipkey?: any) => {
    let btn: any = null;
    if (typeof key === 'number') {
      const btnRect = this.graphics().generateRect(key, [0, 0, 100, 100, 6], false);
      const btnTexture = TransformImage.transformToTexture(this.game, btnRect);
      key = btnTexture;
    }
    btn = this.image(key, parent, align);
    btn.interactive = !0;
    btn['next'] = null;
    btn.status = 'on';
    const [texture, swtichTexture] = [
      btn.texture,
      Object.prototype.toString.call(switchKey) === '[object String]' ? utils.TextureCache[switchKey] : switchKey
    ];
    btn.on('pointerdown', (e) => {
      btn.blendMode = PIXI.BLEND_MODES.ADD_NPM;
      btn.start && btn.start(e);
    });
    btn.on('pointermove', (e) => {
      btn.move && btn.move(e);
    });
    btn.on('pointerupoutside', (e) => {
      btn.blendMode = PIXI.BLEND_MODES.NORMAL;
      btn.outside && btn.outside(e);
    });
    btn.on('pointerup', (e: Event) => {
      if (btn.blendMode === PIXI.BLEND_MODES.ADD_NPM) {
        btn.blendMode = PIXI.BLEND_MODES.NORMAL;
        if (switchKey) {
          if (btn.status === 'on') {
            btn.status = 'off';
            btn.texture = swtichTexture;
          } else {
            btn.status = 'on';
            btn.texture = texture;
          }
        }
        btn.next && btn.next(e);
      } else {
        btn.cancel && btn.cancel(e);
      }
    });

    if (tipkey) {
      btn['tip'] = this.image(tipkey, parent, [0.5, 0.5]);
    }
    return btn;
  }

  texture(key) {
    return Texture.from(key);
  }

  animation(frames: Array<PIXI.Texture>, speed: number) {
    const anim: AnimatedSprite = new AnimatedSprite(frames);
    anim.animationSpeed = speed || 0.5;
    return anim;
  }

  emitter(game: Game, quality: number, key: string) {
    return new KnEmitter(game, quality, key);
  }
  // 添加graphics实例
  graphics() {
    return new KnGraphics(this.game);
  }

  // 添加点坐标
  pointer(x: number = 0, y: number = 0) {
    return new PIXI.Point(x, y);
  }

  tweenline(vars?: object) {
    return new knTweenLine(vars);
  }

  tween() {
    return new KnTween();
  }

  ticker = () => {
    const ticker = new Ticker();
    ticker.autoStart = false;
    ticker.stop();
    return ticker;
  }

  text(content: string, style: any, anchor: Array<number>) {
    let entryFontsize = style.fontSize;
    entryFontsize && (style.fontSize = 3 * entryFontsize);
    const text = new KnText(this.game, content, style, anchor);
    text.scale.set(0.34);
    return text;
  }

  section(label: string = '', content: string, size: number, parent: KnGroup, sectionStyle: any) {
    const section = this.group(`sect_${new Date().getTime()}`, parent);
    const {padding = 4, bg = 0xd10311, width = 0} = sectionStyle;

    // 标签文本
    const labelText = this.text(label, {
      fontSize: size,
      fill: '#ffffff',
      stroke: 0x000000,
      strokeThickness: 6,
      wordWrap: !0,
      wordWrapWidth: width || 0
    }, [0.5, 0]);

    // 纯文本
    const text = this.text(content, {
      fontSize: size,
      fill: '#000000',
    }, [0, 0.5]); 
    const rect = this.graphics().generateRect(bg, [0, 0, labelText.width + padding, labelText.height + padding, 4], false);
    labelText.position.set(rect.width * 0.5, padding * 0.5);
    text.position.set(rect.width + 2, rect.height * 0.5);
    section.addChild(rect, text, labelText);
    return section;
  }

  tiling(key: any, width: number, height: number, parent: KnGroup) {
    const texture = Object.prototype.toString.call(key) === '[object String]' ? utils.TextureCache[key] : key;
    const tile = new KnTiling(texture, width, height);
    tile.initialTiling(parent);
    return tile;
  }
}

export default KnFactory;