import KnFactory from "../lib/gameobjects/kn_factory";
import KnLoader from "../lib/loader/kn_loader";
import KnSceneManager from "../lib/gameobjects/kn_scene_manager";
import { Application, settings, SCALE_MODES } from "pixi.js";
import { debounce, math } from "../lib/utils/common";
import KnScene from "./gameobjects/kn_scene";
import KnTranstion from "../lib/gameui/kn_transtion";
import KnCursor from "./gameui/kn_cursor";
import CoverMask from "./dev/editor_mask/cover";
import * as PIXI from "pixi.js";
import EditorTools from "ts@/hive/nnsd/src/tools";
import KnGroup from "./gameobjects/kn_group";

interface EnterProps {
  width: number;
  height?: number;
  ratio?: number;
  antialias?: boolean;
  transparent?: boolean;
  view: any;
  isPureCanvas?: boolean;
  dpr?: number;
}

export default class Game {
  public edit: symbol; // 编辑模式
  public redux: any; // 外部redux对象
  public entryStateKey: string;
  public gui: any;
  public view: HTMLElement;
  public dpr: number;
  public preloader: KnScene;
  public ticker: PIXI.Ticker;
  public math: IMath;
  public editorTools: EditorTools;
  public camera: {
    width?: number;
    height?: number;
    half_w?: number;
    half_h?: number;
  };
  public config: {
    width: number;
    height: number;
    half_w: number;
    half_h: number;
  };
  public stage: PIXI.Container;
  public world: PIXI.Container;
  public coverMask: CoverMask;
  public sceneManager: KnSceneManager;
  public app: Application;
  public loader: KnLoader;
  public add: KnFactory;
  public currentScene: KnScene; // 当前场景
  public overlay: KnTranstion; // 转场遮罩
  public cursor: KnCursor; // 游戏光标
  public size: {
    width: number;
    height: number;
  }; // 游戏尺寸
  entryHive: any;
  editHive: any;
  ratio: number;
  constructor(config: EnterProps) {
    window["PIXI"] = PIXI;
    this.view = config.view;
    this.dpr = config.dpr || window.devicePixelRatio;
    this.camera = {};
    config.ratio
      ? (this.ratio = config.ratio)
      : (this.ratio = config.width / (config.height || 1000));

    // 设置游戏画布基本尺寸
    this.config = {
      width: config.width,
      height: config.width / this.ratio,
      half_w: config.width * 0.5,
      half_h: (config.width / this.ratio) * 0.5
    };

    this.app = new Application({
      width: this.config.width,
      height: this.config.height,
      antialias: config.antialias || false,
      transparent: config.transparent || !1,
      resolution: this.dpr
    });

    globalThis.__PIXI_APP__ = this.app;

    this.view.appendChild(this.app.view);

    // 添加加载器实例
    this.loader = new KnLoader(this);

    // 添加生成游戏对象的快捷方式
    this.add = new KnFactory(this);

    // 初始化画布
    this.stage = this.app.stage;

    // 定义游戏容器
    this.world = new KnGroup(this, "world", this.stage);

    // 载入相关math方法
    this.math = math;

    // 适配幕布
    this.size = this.resizeStage(this.view, config);

    // 添加场景管理实例
    this.sceneManager = new KnSceneManager(this);

    // 初始化渲染器
    this.app.renderer.render(this.stage);

    // 初始化光标
    this.cursor = new KnCursor(this, this.world);

    // 定义和添加游戏编辑层
    if (!config.isPureCanvas) {
      this.coverMask = new CoverMask(this, this.stage);
      this.coverMask.scale.set(this.size.width / this.config.width);
    }

    // 页面尺寸改变
    window.onresize = () => {
      // 防抖函数
      debounce.handler(() => {
        this.resizeStage(this.view, config);
      });
    };

    // 定义场景render刷新
    this.refresh();
  }

  // 重置画布尺寸
  resizeStage(view: Element, config: EnterProps) {
    const RATIO = this.ratio;
    let SCREEN_WIDTH: number | string = window.getComputedStyle(view).width;
    let SCREEN_HEIGHT: number | string = window.getComputedStyle(view).height;
    SCREEN_WIDTH = +SCREEN_WIDTH.substr(0, SCREEN_WIDTH.length - 2);
    SCREEN_HEIGHT = +SCREEN_HEIGHT.substr(0, SCREEN_HEIGHT.length - 2);
    const Cur_Ratio: number = SCREEN_WIDTH / SCREEN_HEIGHT;
    let size: any = null;
    if (Cur_Ratio > RATIO) {
      size = {
        width: SCREEN_HEIGHT * RATIO,
        height: +SCREEN_HEIGHT
      };
    } else {
      size = {
        width: +SCREEN_WIDTH,
        height: SCREEN_WIDTH / RATIO
      };
    }

    this.app.view.style.width = size.width + "px";
    this.app.view.style.height = size.height + "px";

    // 屏幕适配
    this.app.renderer["autoResize"] = true;
    this.app.renderer.resize(size.width, size.height);
    settings.SCALE_MODE = SCALE_MODES.NEAREST;
    settings.FILTER_RESOLUTION = window.devicePixelRatio;

    // 游戏容器适配
    this.world.scale.set(size.width / config.width);

    // 镜头尺寸设置
    this.camera.width = size.width;
    this.camera.height = size.height;
    this.camera.half_w = size.width * 0.5;
    this.camera.half_h = size.height * 0.5;
    return size;
  }

  refresh() {
    // 创建刷新器
    this.ticker = this.add.ticker();
  }
}
