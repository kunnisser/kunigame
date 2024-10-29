/*
 * @Author: kunnisser
 * @Date: 2024-02-28 09:50:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-10-29 17:36:36
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/jps/scene.ts
 * @Description: ---- 临时文件 ----
 */
import { Filter, ParticleContainer, SimpleRope } from "pixi.js";
import Game from "ts@/kuni/lib/core";
import KnPanel from "ts@/kuni/lib/gameobjects/kn_panel";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import KnModal from "ts@/kuni/lib/gameui/kn_modal";
import { rem } from "ts@/kuni/lib/utils/common";

class Node {
  public x: number;
  public y: number;
  public parent: null | Node;
  public g: number; // 已走出的路径数
  public h: number; // 距离终点的曼哈顿路径数
  jumpX: number;
  jumpY: number;
  constructor(x: number, y: number, parent = null) {
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.g = 0;
    this.h = 0;
    this.jumpX = this.x;
    this.jumpY = this.y;
  }

  get f() {
    return this.g + this.h;
  }

  // 获取曼哈顿距离 H值（当前节点至终点）
  estimateH(goal: Node) {
    return Math.abs(goal.x - this.x) + Math.abs(goal.y - this.y);
  }

  // 判断节点是否为障碍物
  isObstacle(x: number, y: number, transposeMatrix: Array<Array<number>>) {
    return transposeMatrix[x][y] === 1;
  }

  // 判断是否为起点
  isStartNode() {
    return !!this.parent;
  }

  // 判断是否为终点
  isEndNode(end: Node) {
    return this.x === end.x && this.y === end.y;
  }

  // 判断当前节点与父节点是否在一条直线上（水平垂直）
  isStraight() {
    return (
      this.parent && (this.x === this.parent.x || this.y === this.parent.y)
    );
  }

  isOverBoundary(x: number, y: number, transposeMatrix: Array<Array<number>>) {
    return !(transposeMatrix[x] !== void 0 && transposeMatrix[x][y] !== void 0);
  }

  straightJump(transposeMatrix, directions) {
    for (let i = 0; i < directions.length; i++) {
      const { x: dx, y: dy } = directions[i];
      this.jumpX = this.x;
      this.jumpY = this.y;
      while (
        !this.isOverBoundary(this.jumpX, this.jumpY, transposeMatrix) &&
        !this.isObstacle(this.jumpX, this.jumpY, transposeMatrix)
      ) {
        this.jumpX += dx;
        this.jumpY += dy;
      }
    }
    return true;
  }

  getJumpPointer(transposeMatrix: Array<Array<number>>) {
    const straightDirection = [
      {
        x: -1,
        y: 0
      },
      {
        x: 1,
        y: 0
      },
      {
        x: 0,
        y: -1
      },
      {
        x: 0,
        y: 1
      }
    ];
    this.straightJump(transposeMatrix, straightDirection);
    // const slashDirection = [
    //   { x: -1, y: -1 },
    //   { x: -1, y: 1 },
    //   { x: 1, y: -1 },
    //   { x: 1, y: 1 }
    // ];
    // for (let i = 0; i < slashDirection.length; i++) {
    //   const { x: sx, y: sy } = slashDirection[i];
    //   this.jumpX = this.x + sx;
    //   this.jumpY = this.y + sy;
    //   while (
    //     !this.isOverBoundary(this.jumpX, this.jumpY, transposeMatrix) &&
    //     !this.isObstacle(this.jumpX, this.jumpY, transposeMatrix)
    //   ) {
    //     this.jumpX += dx;
    //     this.jumpY += dy;
    //   }
    // }
  }
}

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
  openList: never[];
  closedList: never[];
  constructor(game: Game, key: string) {
    super(game, key);
    this.game = game;
    this.resources = {
      bg: "assets/images/bg.png",
      tiled: "assets/images/tiled.png"
    };
    this.turnPoints = [];
    this.shoot = false;
    this.openList = [];
    this.closedList = [];
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
    const endIndices = [8, 4];
    const startNode = new Node(startIndices[0], startIndices[1]);
    const endNode = new Node(endIndices[0], endIndices[1]);
    console.log(startNode, endNode);
    startNode.getJumpPointer(transposeMatrix);
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Temp;
