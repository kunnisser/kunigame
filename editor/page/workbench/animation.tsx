/*
 * @Author: kunnisser
 * @Date: 2023-07-18 10:56:05
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-18 17:34:26
 * @FilePath: /kunigame/editor/page/workbench/animation.tsx
 * @Description: ---- 帧动画 ----
 */
import { CombineReducer } from "editor@/common/store";
import { AnimatedSprite, utils } from "pixi.js";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
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
    index: 0
  } as any);
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );

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
    createGame();
    const [frame, scale] = setAnimationThumb();
    generateAnimationPanel(frame, scale);
    bindAnimationOperation();
  }, []);

  const bindAnimationOperation = () => {
    const { borderGraphics, frameSprites, borderSize } = ref.current;
    document.onkeyup = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "ArrowRight") {
        const currentIndex: number = ref.current.index + 1;
        changeFrame(currentIndex, borderGraphics, frameSprites, borderSize);
      } else if (e.key === "ArrowLeft") {
      }
      console.log(e);
    };
  };

  const generateAnimationPanel = (frame, scale) => {
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

    const anim: AnimatedSprite = animationGame.add.animation(frame, 0.55);
    previewGroup.addChild(anim);
    anim.scale.set(scale);
    anim.anchor.set(0.5);

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

  const setAnimationThumb = () => {
    const frameGroup = animationGame.add.group(
      "animationFrameGroup",
      animationGame.world
    );
    const borderSize = animationGame.config.height * 0.2;
    let scaleRatio = 1;
    frameGroup.position.set(0, animationGame.config.height - borderSize - 100);

    const gameResources = currentScene.game.loader.preloader.resources;
    const resourceKeys = Object.keys(currentScene.resources);
    const atlas: any = {};
    resourceKeys
      .filter((key: string) => {
        return ["json"].indexOf(gameResources[key].extension) > -1;
      })
      .map((resourceKey) => {
        return (atlas[resourceKey] = gameResources[resourceKey].data.frames);
      });
    const keys = Object.keys(atlas.boy);
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
      scaleRatio = borderSize / spriteSize;
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
    return [keys.map((key: string) => utils.TextureCache[key]), scaleRatio];
  };

  const changeFrame = (index, borderGraphics, frameSprites, borderSize) => {
    borderGraphics.clear();
    ref.current.animation.gotoAndStop(index);
    console.log(index);
    console.log(frameSprites, borderGraphics);
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
    if (type === "animation") {
      animationGame.ticker.start();
    } else {
      animationGame.ticker.stop();
    }
  }, [type]);
  return <div id="previewAnimation"></div>;
};

export default AnimationEditor;
