/*
 * @Author: kunnisser
 * @Date: 2024-02-28 09:50:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-09-27 14:49:45
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/temp/scene.ts
 * @Description: ---- 临时文件 ----
 */
import { Filter, InteractionEvent, SimpleRope } from "pixi.js";
import Game from "ts@/kuni/lib/core";
import KnPanel from "ts@/kuni/lib/gameobjects/kn_panel";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import KnModal from "ts@/kuni/lib/gameui/kn_modal";
import { math, rem } from "ts@/kuni/lib/utils/common";

class Temp extends KnScene {
  filter: Filter;
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
      menu: "assets/images/waterPlanet.png",
      panelTitle: "assets/images/modalTitle.png",
      panelBg: "assets/images/tempBg.png",
      score: "assets/images/score.png",
      close: "assets/images/close.png",
      restart: "assets/images/restart.png",
      laser: "assets/images/hp_inner_bar.png",
      vertex: "assets/shader/vertex/default.vert",
      glow: "assets/shader/glow.frag",
      beams: "assets/images/beams.png",
      star: "assets/images/weapon_able.png"
    };
    this.turnPoints = [];
    this.shoot = false;
  }

  boot() {}

  create() {
    const gameBg = this.game.add.background("bg", "bg");
    this.addChild(gameBg);
    // this.cardContainer = this.game.add.panel("testCard", this);
    // this.cardContainer.background = this.game.add.sprite("panelBg", "panelBg");
    // const fillColor = 0x6c5d53;
    // this.cardContainer.setPosition(
    //   this.game.config.half_w,
    //   this.game.config.half_h
    // );
    // this.cardContainer.setPadding(rem(40));
    // const icon = this.game.add.sprite("score", "score", [0, 0.5]);
    // const text4 = this.game.add.text(
    //   "weaponPart",
    //   "破碎的法杖碎片",
    //   {
    //     fontSize: rem(40),
    //     fill: fillColor,
    //     fontWeight: 800
    //   },
    //   [0, 0.5]
    // );
    // this.cardContainer.point.y += icon.height * 0.5;
    // this.cardContainer.addRow([icon], "left", 0);
    // this.cardContainer.addRow([text4], "left", rem(20));
    // const text1 = this.game.add.text(
    //   "tmpText",
    //   "默认技能：躲避单次技能或者普通伤害并强化累加到下一次普攻伤害，最高叠加3层（30%触发）",
    //   {
    //     fontSize: rem(28),
    //     fill: fillColor,
    //     wordWrap: true,
    //     wordWrapWidth: this.cardContainer.maxWidth,
    //     lineHeight: rem(50),
    //     breakWords: true
    //   },
    //   [0, 0]
    // );
    // this.cardContainer.addColumn([text1], "left", icon.height * 0.75);

    this.startPoint = this.game.add.pointer(100, 100);
    // const endPoint = this.game.add.pointer(400, 500);

    // this.laser = this.game.add.graphics();
    this.laserTexture = PIXI.utils.TextureCache["beams"];

    // 创建rope纹理平铺

    // const dpr = 1;
    // this.laserTexture.orig.height /= dpr;
    // this.laserTexture.orig.width /= dpr;

    console.log(this.laserTexture, this.game.dpr);

    // const tween = this.game.add.tween();
    // tween.instance.to(this.laser, 0.15, {
    //   alpha: 0.6,
    //   ease: tween.bounce.easeInOut,
    //   yoyo: true,
    //   repeat: -1
    // });
    // laser.endFill();
    // laser.rotation = angle;

    const star = this.game.add.sprite("star", "star", [0.5, 0.5]);
    star.position.set(this.startPoint.x, this.startPoint.y);
    this.pos = this.startPoint;
    this.nodes = [this.startPoint, this.pos];
    // textureScale > 0 则repeat
    this.laser = new PIXI.SimpleRope(this.laserTexture, this.nodes, 1);
    this.laser.position.set(0, 0);
    this.delta = 0;

    const frag = `
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform float iTime;
    uniform float width;
    uniform float height;
  
    void main() {
    vec2 uv = vTextureCoord;
    float w_side = 2. / width;
    float h_side = 2./ height;
    vec4 color = texture2D(uSampler, uv);
    // 从纹理坐标四周嗅探出alpha之和是否为1， 而当前的color.a如果为0.则判定是边界轮廓
    float ret = 0.0;
    for (int i = -3; i <= 3; ++i) {
      for (int j = -3; j <= 3; ++j){
      float s = texture2D(uSampler, uv + vec2(float(i) * w_side, float(j) * h_side)).a;
          // float top = texture2D(uSampler, uv + vec2(0., side)).a;
          // float bottom = texture2D(uSampler, uv + vec2(0., -side)).a;
          // float right = texture2D(uSampler, uv + vec2(side, 0.)).a;
          ret += s;
      }
    }
    
    float res = clamp(ret, 0.0, 1.0);

    res *= (1. - color.a);

    float d = ret;

    float glow = clamp(d / 20., 0., 1.0);
  
    gl_FragColor = mix(color, vec4(vec3(glow, 0.0, 0.0), res * glow) * abs(sin(iTime)), res);
  }
    `;
    this.filter = new Filter(void 0, frag, {
      iTime: this.delta,
      width: this.laser.width,
      height: this.laser.height
    });
    this.laser.filters = [this.filter];

    this.addChild(this.laser, star);

    gameBg.interactive = true;
    gameBg.on("pointerdown", (event: InteractionEvent) => {
      this.pos = event.data.getLocalPosition(this.game.currentScene);
      this.shoot = true;
      this.laser.visible = true;
    });

    gameBg.on("pointermove", (event: InteractionEvent) => {
      this.pos = event.data.getLocalPosition(this.game.currentScene);
    });

    gameBg.on("pointerup", (event: InteractionEvent) => {
      this.shoot = false;
      this.laser.visible = false;
    });

    // const options = [
    //   {
    //     key: "menu",
    //     name: "富甲天下",
    //     callback: () => {
    //       this.modal.showPanel()
    //     }
    //   },
    //   {
    //     key: "menu",
    //     name: "先知",
    //     callback: () => {
    //       this.modal.showPanel()
    //     }
    //   },
    //   {
    //     key: "menu",
    //     name: "段正淳",
    //     callback: () => {
    //       console.log("段段小鸡鸡");
    //     }
    //   },
    //   {
    //     key: "menu",
    //     name: "排行榜"
    //   },
    //   {
    //     key: "menu",
    //     name: "我服"
    //   }
    // ];
    // const scrollMenu = new KnScrollMenu(this.game, this, options, !0, 1.6);
    // const bgRect = this.game.add
    //   .graphics()
    //   .generateRect(
    //     0xd10311,
    //     [0, 0, this.game.config.width, rem(300)],
    //     !0
    //   );
    // const menuBg = TransformImage.transformToSprite(
    //   this.game,
    //   bgRect,
    //   scrollMenu
    // );
    // menuBg.alpha = 1;
    // menuBg.anchor.set(0.5);
    // scrollMenu.position.set(this.game.config.half_w, this.game.config.height - menuBg.height * 0.5);
    // scrollMenu.initial(menuBg);
    // this.addModal();
  }

  addModal() {
    const options = {
      type: "scroll",
      modalBg: "panelBg",
      titleBg: "panelTitle",
      close: "close",
      maskCloseAble: false,
      panels: [
        {
          title: "游戏失败",
          build: this.addInfo
        }
      ]
    };
    this.modal = new KnModal(this.game, this, options);
    console.log(this.modal);
  }

  addInfo = (modal) => {
    this.restart = this.game.add.button(
      "restart",
      "restart",
      null,
      modal.content,
      [0.5, 0.5]
    );
    this.restart.position.set(
      modal.overlay.width * 0.5,
      modal.overlay.height * 0.5
    );

    const score = this.game.add.image("", "score", modal.content);
    score.y = modal.overlay.height * 0.81;
    const scoreTitle = this.game.add.section(
      "历史最高",
      "100",
      rem(30),
      modal.content,
      {
        padding: [rem(40), rem(10)],
        bg: 0xe5b240,
        border: rem(20),
        space: rem(20)
      }
    );
    scoreTitle.position.set(
      score.width + rem(30),
      score.y + (score.height - scoreTitle.height) * 0.5
    );
    // const size = 24;
    // const attack = this.game.add.section("攻击力", "50-120", size, modal.content, {
    //   padding: 6,
    //   bg: 0x00a6cc
    // });
  };

  update() {
    this.delta += 0.025;
    this.filter.uniforms.iTime = this.delta;
    if (this.shoot) {
      this.filter.uniforms.width = this.laser.width;
      this.filter.uniforms.height = this.laser.height;
      // const dx = (this.pos.x - this.startPoint.x) * 0.25;
      // const dy = (this.pos.y - this.startPoint.y) * 0.25;
      // const distance = Math.sqrt(dx * dx + dy * dy) * 0.12;
      // for (let i = 1; i < 4; i++) {
      //   const rx =
      //     this.startPoint.x +
      //     math.realInRange(dx * i - distance, dx * i + distance);
      //   const ry =
      //     this.startPoint.y +
      //     math.realInRange(dy * i - distance, dy * i + distance);
      //   this.nodes[i] = this.game.add.pointer(rx, ry);
      // }
      this.nodes[1] = this.pos;
    }
  }

  reset() {
    if (this.children.length > 1) {
      // 清除场景对象
      this.removeChildren(1, this.children.length);
    }
  }
}

export default Temp;
