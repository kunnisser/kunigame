/*
 * @Author: kunnisser
 * @Date: 2023-07-07 13:49:58
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-11 17:48:46
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

let previewGame: null | Game = null;
let particleCotainer: any = null;
let stats: any = null;
let ticker: any = null;
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
    const previewParticleDom: any = document.getElementById("previewParticle");
    if (!previewGame) {
      const dpr = window.devicePixelRatio;
      stats = Stats();
      previewParticleDom.style.position = "relative";
      stats.dom.style.position = "absolute";
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
      previewParticleDom.appendChild(stats.dom);
      particleCotainer = previewGame.add.group(
        "particleEditorGroup",
        previewGame.world
      );
      particleCotainer.position.set(previewGame.editX, previewGame.editY);
    } else {
      previewGame.stage.removeChildren();
    }

    return () => {
      game.ticker.destroy();
    };
  }, []);

  // 多个粒子单次发射
  const multeShootOnce = (emitter, tween, pointX: number, pointY: number) => {
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
    const tween = game.add.tween();
    const emitter = game.add.emitter(game, 100, "attack");
    particleCotainer.addChild(emitter);
    ticker && ticker.destroy();
    console.log(ticker);
    ticker = null;
    ticker = game.ticker.add((delta) => {
      stats.begin();
      emitter.throtting -= 1;
      if (emitter.throtting < 0) {
        multeShootOnce(emitter, tween, target.x, target.y);
        emitter.throtting = 10;
      }
      stats.end();
    });
    game.ticker.start();
    // emitter.throtting -= 1;
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
    dispatch(setParticleGameItem(target));
  };

  useEffect(() => {
    if (currentScene && particleCotainer) {
      if (currentGameItem) {
        const [cloneGameItem]: any = _.cloneDeep(currentGameItem);
        cloneGameItem.interactive = false;
        particleCotainer.removeChildren();
        particleCotainer.addChild(cloneGameItem);
        generateParticle(cloneGameItem);
      } else {
        particleCotainer.removeChildren();
      }
    }
  }, [currentScene, currentGameItem, type]);

  return (
    <>
      <div id="previewParticle"></div>
    </>
  );
};

export default ParticleEditor;
