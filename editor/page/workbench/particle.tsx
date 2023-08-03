/*
 * @Author: kunnisser
 * @Date: 2023-07-07 13:49:58
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-08-03 16:50:08
 * @FilePath: /kunigame/editor/page/workbench/particle.tsx
 * @Description: ---- 粒子特效 ----
 */

import {
  setEmitter,
  setParticleVars
} from "editor@/common/gameStore/scene/action";
import { CombineReducer } from "editor@/common/store";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as _ from "lodash";
import Game from "ts@/kuni/lib/core";
import Stats from "stats-js";
import { createFrom } from "ts@/kuni/lib/utils/common";
import KnEmitter from "ts@/kuni/lib/gameobjects/kn_emitter";

let previewGame: any = null;
let particleContainer: any = null;
let stats: any = null;
let prevTicker: any = null;
let emitter: KnEmitter;
let tween: any = null;
const ParticleEditor = (props: any) => {
  const dispatch = useDispatch();
  const ref: any = useRef({
    throtting: 10,
    duration: 1,
    count: 1,
    offsetX: 100,
    offsetY: 100,
    xRandom: true,
    yRandom: true,
    xDirect: true,
    yDirect: true,
    ease: "linear",
    inout: "easeNone",
    angle: 360,
    angleRandom: true,
    angleDirect: true,
    width: 0,
    height: 0,
    particleTexture: "attack"
  });

  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const currentGameItems = useSelector(
    (store: CombineReducer) => store.sceneReducer.gameItem
  );
  const game: Game = useSelector(
    (store: CombineReducer) => store.sceneReducer.game
  );
  const particleVars = useSelector(
    (store: CombineReducer) => store.sceneReducer.particleVars
  );
  const { type } = props;

  const defaultParticleVars = ref.current;

  useEffect(() => {
    stats = Stats();
    stats.dom.style.position = "absolute";
    const dom = createGame();
    dom.style.position = "relative";
  }, []);

  const createGame = () => {
    const previewParticleDom: any = document.getElementById("previewParticle");
    const dpr = window.devicePixelRatio;
    previewGame = new Game({
      width: previewParticleDom.clientWidth * dpr * 2,
      ratio: previewParticleDom.clientWidth / previewParticleDom.clientHeight,
      dpr,
      antialias: true,
      transparent: true,
      view: previewParticleDom,
      editorWidth: game.config.editorWidth,
      editorHeight: game.config.editorHeight
    });
    previewParticleDom.appendChild(previewGame.app.view);
    previewParticleDom.appendChild(stats.dom);
    particleContainer = previewGame.add.group(
      "particleEditorGroup",
      previewGame.world
    );
    tween = previewGame.add.tween();
    particleContainer.position.set(previewGame.editX, previewGame.editY);
    return previewParticleDom;
  };

  const particleBooleanDispose = (bool, ret: any) => {
    return bool ? ret : 1;
  };

  // 粒子发射
  const multeShootOnce = (pointX: number, pointY: number) => {
    const {
      xDirect,
      xRandom,
      yDirect,
      yRandom,
      offsetX,
      offsetY,
      count,
      duration,
      ease,
      inout,
      angle,
      angleRandom,
      angleDirect,
      width,
      height
    } = ref.current;
    const particles: Array<any> = emitter.shootMulite(count);
    for (let particle of particles) {
      particle.x = pointX + game.math.redirect() * Math.random() * width;
      particle.y = pointY + game.math.redirect() * Math.random() * height;
      tween.instance.to(particle, duration, {
        x:
          particle.x +
          particleBooleanDispose(xDirect, game.math.redirect()) *
            particleBooleanDispose(xRandom, Math.random()) *
            offsetX,
        y:
          particle.y +
          particleBooleanDispose(yDirect, game.math.redirect()) *
            particleBooleanDispose(yRandom, Math.random()) *
            offsetY,
        angle:
          particle.angle +
          particleBooleanDispose(angleDirect, game.math.redirect()) *
            particleBooleanDispose(angleRandom, Math.random()) *
            angle,
        alpha: 0,
        ease: tween[ease][inout]
      });
    }
  };

  const generateParticle = (target) => {
    console.log("generateParticle");
    prevTicker = previewGame.add.ticker();
    prevTicker.add((delta) => {
      stats.begin();
      emitter.throtting -= 1;
      if (emitter.throtting < 0) {
        multeShootOnce(target.x, target.y);
        emitter.throtting = ref.current.throtting;
      }
      stats.end();
    });
    prevTicker.start();
  };

  useEffect(() => {
    const editVars = particleVars || defaultParticleVars;
    ref.current = editVars;
  }, [particleVars]);

  useEffect(() => {
    if (type === "particle" && currentScene && currentGameItems) {
      previewGame.app.stage || createGame();
      particleContainer.children.length > 1 &&
        particleContainer.removeChildAt(1);
      const [currentGameItem] = currentGameItems;
      const cloneGameItem: any = createFrom(currentGameItem, previewGame);
      cloneGameItem.parent = null;
      emitter = previewGame.add.emitter(
        previewGame,
        10,
        ref.current.particleTexture
      );
      particleContainer.addChild(emitter);
      particleContainer.addChild(cloneGameItem);
      generateParticle(currentGameItem);
      dispatch(setEmitter(emitter));
      dispatch(setParticleVars(particleVars || defaultParticleVars));
    } else {
      prevTicker && prevTicker.stop() && prevTicker.destroy();
    }

    return () => {
      previewGame && previewGame.stage.removeChildren();
      previewGame.app.renderer &&
        previewGame.app.renderer.context.gl
          .getExtension("WEBGL_lose_context")
          .loseContext();
      previewGame.app.stage &&
        previewGame.app.destroy(true, { children: true });
    };
  }, [currentScene, currentGameItems, type]);

  return (
    <>
      <div id="previewParticle"></div>
    </>
  );
};

export default ParticleEditor;
