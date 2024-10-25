/*
 * @Author: kunnisser
 * @Date: 2024-02-28 09:50:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-10-25 17:23:38
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/jps/scene.ts
 * @Description: ---- 临时文件 ----
 */
import {
  Filter,
  InteractionEvent,
  ParticleContainer,
  SimpleRope
} from "pixi.js";
import Game from "ts@/kuni/lib/core";
import KnPanel from "ts@/kuni/lib/gameobjects/kn_panel";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import KnModal from "ts@/kuni/lib/gameui/kn_modal";
import { rem } from "ts@/kuni/lib/utils/common";

class Temp extends KnScene {
  filter: Filter;
  bgFilter: Filter;
  game: Game;
  modal: KnModal;
  restart: any;
  cardContainer: KnPanel;
  turnPoints: any;
  laser: SimpleRope;
  shoot: boolean;
  pos: PIXI.Point;
  startPoint: PIXI.Point;
  laserTexture: PIXI.Texture;
  nodes: PIXI.Point[];
  delta: number;
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      bg: "assets/images/bg.png",
      tiled: "assets/images/tiled.png"
    };
    this.turnPoints = [];
    this.shoot = false;
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background("bg", "bg");
    this.addChild(gameBg);
    const tiledContainer = new ParticleContainer();
    this.addChild(tiledContainer);

    const matrix = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 3, 0, 0, 1, 0, 0, 0, 2, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    const transposeMatrix = matrix[0].map((_: number, index) =>
      matrix.map((mat) => mat[index])
    );

    const tiledSprites: Array<KnSprite> = [];
    for (const [x, lines] of transposeMatrix.entries()) {
      console.log(x, lines);
      for (const [y, tile] of lines.entries()) {
        const sp = this.game.add.sprite("tiled", "tiled", [0.5, 0.5]);
        tile === 3 && (sp.tint = 0x1123db);
        tile === 1 && (sp.tint = 0xd10311);
        tile === 2 && (sp.tint = 0x008dff);
        const { width } = sp;
        const space = width + rem(2);
        sp.position.set(space * x, space * y);
        tiledSprites.push(sp);
      }
    }
    tiledContainer.addChild(...tiledSprites);
    tiledContainer.containerUpdateTransform();
    const { width, height } = tiledContainer.getBounds();
    tiledContainer.position.set(
      this.game.config.half_w - width * 0.5,
      this.game.config.half_h - height * 0.5
    );

    this.jps(transposeMatrix);
  }

  jps(transposeMatrix: Array<Array<number>>) {
    const startIndices = [1, 4];
    console.log(transposeMatrix[startIndices[0]][startIndices[1]]);
    const endIndices = [8, 4];
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Temp;
