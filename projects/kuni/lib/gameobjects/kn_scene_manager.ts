/* 场景管理 */
import EditorTools from 'ts@/hive/nnsd/src/tools';
import Game from '../core';
import KnScene from '../gameobjects/kn_scene';
import KnTranstion from '../gameui/kn_transtion';

class KnSceneManager {
  public game: Game;
  public scenes: any;
  constructor(game: Game) {
    this.game = game;
    this.scenes = {};
  }

  // 用户自定义添加场景对象
  addScene(id: string, Stage: any, boot?: boolean) {
    console.log('场景已添加 -- ', id);
    const stage = new Stage(this.game, id, boot);
    this.scenes[id] = stage;
    return stage;
  }

  changeScene(from: KnScene | null, to: KnScene) {
    if (from) {
      this.game.overlay = new KnTranstion(this.game);
      this.game.overlay.leaveScene(() => {
        from.exit();
        return this.dispatchScene(to);
      });
    } else {
      return this.dispatchScene(to);
    }
  }

  dispatchScene(to: KnScene) {
    const globalLoader = this.game.loader;
    /** 1.目标场景已缓存
     *  2. 若为加载器场景无需重复进入加载器
     *  3. 目标场景未缓存进入加载器
     * */
    if (to.isCached || !to.resources) {
      console.log(to.id, '已缓存');

      // 进入加载好的界面 to 为要进入的界面
      return to.enter();
    } else if (to.id === 'global_preloader') {
      // 全局loading界面的资源加载 -- 只加载preloader的资源
      globalLoader.filling(to.resources);
      globalLoader.preloader.load(() => {
        console.log('preloadScene resource is ready!');
        this.scenes['global_preloader'].enter(this.game.entryHive);
      });
    } else {
      // 首次进入场景且场景有资源需要加载，则会自动进入preloader场景
      console.log('首次进入', to.id);
      return this.scenes['global_preloader'].enter(to);
    }
  }

  // 编辑场景跳转
  dispatchEditScene(to: KnScene) {
    if (to.isCached || !to.resources) {
      console.log(to.id, '已缓存');

      // 进入加载好的界面 to 为要进入的界面
      this.game.currentScene = to;

      const enterScene = to.enter();

      this.game.currentScene.isBinded = true;

      // 开发模式
      this.game.editorTools = new EditorTools(this.game);
      return enterScene;
    } else {
      let globalLoader = this.game.loader;
      // 全局loading界面的资源加载
      globalLoader.filling(to.resources);

      return new Promise((resolve) => {
        globalLoader.preloader.load(() => {
          console.log(to.id + ' resource is ready!');
          to.isCached = true;
          this.game.currentScene = to;
          resolve(to.enter());
          // 开发模式
          this.game.editorTools = new EditorTools(this.game);
        });
      });
    }
  }

  // 退出场景
  exitEditScene(target: KnScene) {
    this.game.editorTools.reset();
    target.exit();
  }
}

export default KnSceneManager;
