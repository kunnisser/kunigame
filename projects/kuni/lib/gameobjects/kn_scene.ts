/* 场景基础类 */

import { Container } from 'pixi.js';
import KnGraphics from './kn_graphics';
import KnMessage from '../gameui/kn_message';

class KnScene extends Container {
  public game: any;
  public id: string;
  public name: string;
  public isBoot: boolean;
  public resources: object;
  public isCached: boolean;
  public isBinded: boolean; // 用于判断各种事件是否已绑定
  public loader: PIXI.Loader;
  public dat?: any;
  public drawStage: KnGraphics;
  public tip: KnMessage;
  public cancelActionStack: Array<any>; // 工具撤销操作栈
  public resumeActionStack: Array<any>; // 工具恢复操作栈
  public pool: Array<any>; //对象池
  constructor(game: object, key: string) {
    super();
    this.game = game;
    this.id = key;
    this.name = key;
    this.isBoot = !1;
    this.isCached = !1;
    this.isBinded = !1;
    this.cancelActionStack = [];
    this.resumeActionStack = [];
    this.initial();
  }

  // 初始化场景实例定义
  initial() {
    const world = this.game.world;
    this.width = world.width;
    this.height = world.height;
    this.pool = [];
  }

  // 进入场景
  enter(nextTarget?: KnScene, isFirstLoad?: Boolean) {
    this.game.world.addChild(this);
    isFirstLoad && this.game.overlay.entryScene();
    this.game.currentScene = this;
    if (this.game.overlay) {
      this.game.overlay.destroy();
      this.game.overlay = null;
    }
    if (!this.isBoot) {
      this.boot(nextTarget);
      this.signBooting();
      this.create();
      // ticker只能在首次加载注册，否则会注册多个事件
      this.game.ticker.add((delta) => {
        this.update(delta);
      });
    }
    this.game.ticker.start();
    return this;
  }

  loading(nextTarget: KnScene) {
    throw new Error('Method not implemented.');
  }

  // 离开场景
  exit() {
    this.game.ticker.stop();
    this.game.ticker.destroy();
    this.remove();
    this.game.currentScene = null;
  }

  // 构建场景
  create() {}

  // 激活
  boot(target?: KnScene, isFirstLoad?: Boolean) {}

  // 标记激活
  signBooting() {
    this.isBoot = true;
  }

  // 刷新场景
  update(delta: number, options?: object) {}

  // 删除场景
  remove() {
    this.game.world.removeChild(this);
  }

  // 内置消息提示组件
  bootMessage() {
    this.tip = new KnMessage(this.game, this);
    this.tip.position.set(this.game.config.half_w, this.game.config.half_h);
  }
}

export default KnScene;
