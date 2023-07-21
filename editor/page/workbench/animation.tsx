/*
 * @Author: kunnisser
 * @Date: 2023-07-18 10:56:05
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-21 17:15:20
 * @FilePath: /kunigame/editor/page/workbench/animation.tsx
 * @Description: ---- 帧动画 ----
 */
import { setAnimationVars } from "editor@/common/gameStore/scene/action";
import { CombineReducer } from "editor@/common/store";
import { AnimatedSprite, utils } from "pixi.js";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Game from "ts@/kuni/lib/core";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
let animationGame: Game;
const AnimationEditor = (props: any) => {
  const { type } = props;
  const ref = useRef({
    animation: null,
    borderGraphics: null,
    frameSprites: null,
    index: 0,
    borderSize: 0,
    animationName: ""
  } as any);
  const dispatch = useDispatch();
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const animationVars = useSelector(
    (store: CombineReducer) => store.sceneReducer.animationVars
  );
  const defaultAnimationVars = {
    speed: 1,
    name: "",
    loop: true,
    range: null
  };
  const createGame = () => {
    const animationDom: any = document.getElementById("previewAnimation");
    const dpr = window.devicePixelRatio;
    animationGame = new Game({
      width: animationDom.clientWidth * dpr * 2,
      ratio: animationDom.clientWidth / animationDom.clientHeight,
      dpr,
      antialias: true,
      transparent: true,
      view: animationDom,
      isPureCanvas: true
    });
    return animationDom;
  };

  useEffect(() => {
    dispatch(setAnimationVars(animationVars || defaultAnimationVars));
    createGame();
  }, []);

  const bindAnimationOperation = () => {
    const { borderGraphics, frameSprites, borderSize } = ref.current;
    const frameLength: number = frameSprites.length;
    const moveFlagX = animationGame.config.width - borderSize - 50;
    document.onkeyup = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "ArrowRight") {
        const currentIndex: number = ref.current.index + 1;
        if (
          currentIndex * borderSize > moveFlagX &&
          currentIndex < frameLength
        ) {
          const s = animationGame.world.getChildByName("animationFrameGroup");
          s.x -= borderSize + 50;
        }
        changeFrame(
          currentIndex >= frameLength ? frameLength - 1 : currentIndex,
          borderGraphics,
          frameSprites,
          borderSize
        );
      } else if (e.key === "ArrowLeft") {
        const s = animationGame.world.getChildByName("animationFrameGroup");
        if (ref.current.index * borderSize > moveFlagX) {
          s.x += borderSize + 50;
        } else {
          s.x = 0;
        }
        const currentIndex: number = ref.current.index - 1;
        changeFrame(
          currentIndex < 0 ? 0 : currentIndex,
          borderGraphics,
          frameSprites,
          borderSize
        );
      }
    };
  };

  // 切换帧动画素材，变更界面显示
  const gererateAnimationShow = (name?: string) => {
    animationGame.world.removeChildren();
    setAnimationThumb(name);
  };

  // 设置动画帧列表
  const setAnimationThumb = (name?: string) => {
    const frameGroup = animationGame.add.group(
      "animationFrameGroup",
      animationGame.world
    );
    ref.current.index = 0;
    const borderSize = animationGame.config.height * 0.2;
    frameGroup.position.set(0, animationGame.config.height - borderSize - 100);
    const loader = currentScene.game.loader.preloader;
    const gameResources = loader.resources;
    const resourceKeys = Object.keys(currentScene.resources);
    const atlasKeys = resourceKeys.filter((key: string) => {
      return ["json"].indexOf(gameResources[key].extension) > -1;
    });
    if (loader.loading) {
      loader.load(() => {
        setAtlasOptions(frameGroup, borderSize, atlasKeys, loader, name);
      });
    } else {
      setAtlasOptions(frameGroup, borderSize, atlasKeys, loader, name);
    }
  };

  const setAtlasOptions = (
    frameGroup,
    borderSize,
    atlasKeys,
    loader,
    name?: string
  ) => {
    const atlas: any = {};
    atlasKeys.map((resourceKey) => {
      return (atlas[resourceKey] = loader.resources[resourceKey].data.frames);
    });
    const defaultName: string = Object.keys(atlas)[0];
    const keys = Object.keys(atlas[name || defaultName]);
    const frameSprites: Array<KnSprite> = [];
    const borderGraphics: KnGraphics = animationGame.add.graphics(
      "animationThumbBorder"
    );
    frameGroup.addChild(borderGraphics);
    borderGraphics.clear();
    keys.forEach((key, index) => {
      const borderColor = index === ref.current.index ? 0x11b234 : 0xffffff;
      const spriteThumb = animationGame.add.sprite(key, key, [0.5, 0.5]);
      spriteThumb.tint = 0xffffff;
      spriteThumb.position.set(
        borderSize * 0.5 + 50 + index * (borderSize + 50),
        borderSize * 0.5
      );
      spriteThumb.interactive = true;
      spriteThumb.on("pointerdown", () => {
        changeFrame(index, borderGraphics, frameSprites, borderSize);
      });
      const spriteSize =
        spriteThumb.width > spriteThumb.height
          ? spriteThumb.width
          : spriteThumb.height;
      const scaleRatio = borderSize / spriteSize;
      spriteThumb.scale.set(scaleRatio * 0.85);
      borderGraphics.generateRectLineStyle(
        [4, 2],
        borderColor,
        borderColor,
        [spriteThumb.x, spriteThumb.y, borderSize, borderSize],
        { x: 0.5, y: 0.5 }
      );
      frameSprites.push(spriteThumb);
    });
    frameGroup.addChild(...frameSprites);
    ref.current.borderGraphics = borderGraphics;
    ref.current.frameSprites = frameSprites;
    ref.current.borderSize = borderSize;
    const frame = keys.map((key: string) => utils.TextureCache[key]);
    generateAnimationPanel(frame);
    bindAnimationOperation();
  };

  // 设置动画播放预览
  const generateAnimationPanel = (frame) => {
    console.log(frame);
    console.log("animat");
    const previewGroup = animationGame.add.group(
      "animationPreview",
      animationGame.world
    );
    animationGame.ticker.add(() => {
      previewGroup.update();
    });
    previewGroup.position.set(
      animationGame.config.half_w,
      animationGame.config.height * 0.4
    );

    const vars = animationVars || defaultAnimationVars;
    const anim: AnimatedSprite = animationGame.add.animation(frame, vars.speed);
    const size = anim.width > anim.height ? anim.width : anim.height;
    anim.scale.set((ref.current.borderSize / size) * 1.25);
    anim.anchor.set(0.5);
    previewGroup.addChild(anim);
    updateAnimation(anim, vars);

    anim.interactive = true;
    anim.on("pointerdown", () => {
      if (anim.playing) {
        animationGame.ticker.stop();
        anim.stop();
      } else {
        animationGame.ticker.start();
        anim.play();
      }
    });

    ref.current.animation = anim;
  };

  // 更新动画属性
  const updateAnimation = (animation: AnimatedSprite, vars: any) => {
    animation.animationSpeed = vars.speed;
    animation.loop = vars.loop;
  };
  // 切换动画帧
  const changeFrame = (index, borderGraphics, frameSprites, borderSize) => {
    borderGraphics.clear();
    ref.current.animation.gotoAndStop(index);
    frameSprites.forEach((frame, borderIndex) => {
      const borderColor = borderIndex === index ? 0x11b234 : 0xffffff;
      borderGraphics.generateRectLineStyle(
        [4, 2],
        borderColor,
        borderColor,
        [frame.x, frame.y, borderSize, borderSize],
        { x: 0.5, y: 0.5 }
      );
      ref.current.index = index;
    });
  };

  useEffect(() => {
    if (animationVars && ref.current.animation) {
      const { animation, animationName } = ref.current;
      updateAnimation(animation, animationVars);
      if (animationName !== animationVars.name) {
        gererateAnimationShow(animationVars.name);
        ref.current.animationName = animationVars.name;
      }
    }
  }, [animationVars]);

  useEffect(() => {
    if (type === "animation" && currentScene) {
      console.log("show");
      gererateAnimationShow();
      animationGame.ticker.start();
    } else {
      animationGame.ticker.stop();
    }
  }, [type, currentScene]);
  return <div id="previewAnimation"></div>;
};

export default AnimationEditor;
