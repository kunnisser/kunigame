/*
 * @Author: kunnisser
 * @Date: 2023-07-07 13:49:58
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-12 17:39:42
 * @FilePath: /kunigame/editor/page/workbench/particle.tsx
 * @Description: ---- 粒子特效 ----
 */

import { setParticleGameItem } from "editor@/common/gameStore/scene/action";
import { CombineReducer } from "editor@/common/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as _ from "lodash";
import Game from "ts@/kuni/lib/core";
import Stats from "stats-js";
// import KnEmitter from "ts@/kuni/lib/gameobjects/kn_emitter";

let previewGame: any = null;
let particleContainer: any = null;
let stats: any = null;
let prevTicker: any = null;
let emitter: any = null;
let tween: any = null;
const ParticleEditor = (props: any) => {
  const dispatch = useDispatch();
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const currentGameItem = useSelector(
    (store: CombineReducer) => store.sceneReducer.gameItem
  );

  const { type } = props;
  const game: Game = useSelector(
    (store: CombineReducer) => store.sceneReducer.game
  );

  useEffect(() => {
    console.log("particle initial");
    const previewParticleDom: any = document.getElementById("previewParticle");
    if (!previewGame) {
      const dpr = window.devicePixelRatio;
      // stats = Stats();
      // previewParticleDom.style.position = "relative";
      // stats.dom.style.position = "absolute";
      previewGame = new Game({
        width: previewParticleDom.clientWidth * dpr * 2,
        ratio: previewParticleDom.clientWidth / previewParticleDom.clientHeight,
        dpr,
        antialias: true,
        transparent: true,
        view: previewParticleDom,
        isPureCanvas: true,
        editorWidth: game.config.editorWidth,
        editorHeight: game.config.editorHeight
      });
      previewParticleDom.appendChild(previewGame.app.view);
      // previewParticleDom.appendChild(stats.dom);
      particleContainer = previewGame.add.group(
        "particleEditorGroup",
        previewGame.world
      );
      tween = previewGame.add.tween();
      emitter = previewGame.add.emitter(previewGame, 10, "attack");
      const [cloneGameItem]: any = _.cloneDeep(currentGameItem);
      cloneGameItem.interactive = false;
      particleContainer.position.set(previewGame.editX, previewGame.editY);
      particleContainer.addChild(cloneGameItem, emitter);
    } else {
      previewGame.world.removeChildren();
    }
  }, []);

  // 多个粒子单次发射
  const multeShootOnce = (pointX: number, pointY: number) => {
    const particles: Array<any> = emitter.shootMulite(4);
    for (let particle of particles) {
      particle.x = pointX;
      particle.y = pointY;
      tween.instance.to(particle, 0.5, {
        x: particle.x + game.math.redirect() * Math.random() * 100,
        y: particle.y - Math.random() * 200 - 10,
        angle: 100 + game.math.redirect() * Math.random() * 300,
        alpha: 0,
        ease: tween.linear.easeNone
      });
    }
  };

  const generateParticle = (target) => {
    console.log("generateParticle");
    prevTicker = game.add.ticker();
    prevTicker.add((delta) => {
      // stats.begin();
      emitter.throtting -= 1;
      if (emitter.throtting < 0) {
        // multeShootOnce(target.x, target.y);
        emitter.throtting = 40;
      }
      // stats.end();
      // if (emitter.throtting < 0) {
      //   const particle = emitter.shoot();
      //   particle.x = target.x;
      //   particle.y = target.y;
      //   tween.instance.to(particle, 1.6, {
      //     x: 0 + game.math.redirect() * Math.random() * 200,
      //     y: 0 - Math.random() * 200,
      //     angle: 100 + game.math.redirect() * Math.random() * 300,
      //     alpha: 0,
      //     ease: tween.linear.easeNone
      //   });
      //   emitter.throtting = KnEmitter.throtting;
      // }
    });
    prevTicker.start();

    dispatch(setParticleGameItem(target));
  };

  useEffect(() => {
    const previewParticleDom: any = document.getElementById("previewParticle");
    if (type !== "particle") {
      previewParticleDom.firstChild &&
        previewParticleDom.removeChild(previewParticleDom.firstChild);
      prevTicker && prevTicker.stop() && prevTicker.destroy();
    } else if (currentScene && currentGameItem) {
      const [cloneGameItem]: any = _.cloneDeep(currentGameItem);
      cloneGameItem.interactive = false;
      particleContainer.children[0] = cloneGameItem;
      console.log(previewGame);
      console.log(emitter.children.length);
      previewParticleDom.appendChild(previewGame.app.view);
      // generateParticle(cloneGameItem);
    }
  }, [currentScene, currentGameItem, type]);

  return (
    <>
      <div id="previewParticle"></div>
    </>
  );
};

export default ParticleEditor;
