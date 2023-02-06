/* 场景管理 */
import Game from "../core";
import KnScene from "../gameobjects/kn_scene";
import KnTranstion from "../gameui/kn_transtion";

class KnSceneManager {
  public game: Game;
  public scenes: any;
  constructor(game: Game) {
    this.game = game;
    this.scenes = {};
  }

  // 用户自定义添加场景对象
  addScene(id: string, Stage: any, boot?: boolean) {
    console.log("场景已添加 -- ", id);
    const stage = new Stage(this.game, id, boot);
    this.scenes[id] = stage;
    return stage;
  }

  changeScene(from: KnScene | null, to: KnScene) {
    if (from) {
      // 去除特殊的dat.gui
      from.dat && this.game.gui.remove(from.dat);
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
    /** 1.目标场景已缓存
     *  2. 若为加载器场景无需重复进入加载器
     *  3. 目标场景未缓存进入加载器
     * */
    if (to.isCached || !to.resouces) {
      console.log(to.id, "已缓存");

      // 进入加载好的界面 to 为要进入的界面
      return to.enter();
    } else if (to.id === "global_preloader") {
      let globalLoader = this.game.loader;

      // 全局loading界面的资源加载
      for (let key of Object.keys(to.resouces)) {
        globalLoader = globalLoader.add(key, to.resouces[key]);
      }
      globalLoader.load(() => {
        console.log("preloadScene resource is ready!");
        this.scenes["global_preloader"].enter(this.game.entryHive);
      });
    } else {
      // 首次进入场景且场景有资源需要加载，则会自动进入preloader场景
      console.log("首次进入", to.id);
      return this.scenes["global_preloader"].enter(to);
    }
  }

  // 编辑场景跳转
  dispatchEditScene(to: KnScene) {
    return to.enter();
  }

  // 退出场景
  exitEditScene(target: KnScene) {
    target.exit();
  }
}

export default KnSceneManager;
