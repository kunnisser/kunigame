/*
 * @Author: kunnisser 
 * @Date: 2019-09-14 23:40:01 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-09-15 22:48:37
 */

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import Game from 'ts@/lib/core';
import TileMap from 'ts@/lib/gameobjects/kn_tilemap';
import {Rectangle, AnimatedSprite} from 'pixi.js';
import KnLoader from 'ts@/lib/loader/kn_loader';
class MapDemo extends KnScene {
  constructor (game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.initialWorld();
  }

  initialWorld () {
    KnLoader.preloader
    .add('worldmap', './assets/data/worldmap.json')
    .add('world', './assets/images/maptiles.png')
    .add('./assets/data/boy.json');
    KnLoader.preloader.load((loader, resources) => {
      const staticWorldTexture = resources.world.texture;
      let textures = [];
      for (var i = 0, l = 4; i < l; i++) {
        const rectangle = new Rectangle(i * 32, 0, 32, 32);
        const texture = staticWorldTexture.clone();
        texture.frame = rectangle;
        textures.push(texture);
      }
      const tilemap = new TileMap(0, textures, loader.resources.worldmap.data);
      tilemap.position.set(0, 0);
      console.log(tilemap);
      this.addChild(tilemap);
      this.initialBoy();
    });
  }

  initialBoy () {
    const frames = {
      down: [],
      up: [],
      left: [],
      right: []
    };
		for (let i = 0, l = 4; i < l; i++) {
      frames.down.push(this.game.add.texture(`down0${i}.png`));
      frames.left.push(this.game.add.texture(`left0${i}.png`));
			frames.up.push(this.game.add.texture(`up0${i}.png`));
			frames.right.push(this.game.add.texture(`right0${i}.png`));
    }
    const boy: AnimatedSprite = this.game.add.animation(frames.down, 0.2);
    boy.width = 24;
    boy.height = 32;
    boy.position.set(144, 80);
    boy.anchor.set(0.5);
    this.addChild(boy);
    boy.textures = frames.right;
    boy.play();
    boy.interactive = true;
    boy.on('pointerdown', (e) => {
      console.log(e);
    });
  }

  astar () {
    
  }
}

export default MapDemo;
