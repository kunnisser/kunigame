/*
 * @Author: kunnisser
 * @Date: 2023-07-07 13:49:58
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-07 17:32:23
 * @FilePath: /kunigame/editor/page/workbench/particle.tsx
 * @Description: ---- 粒子特效 ----
 */

import { setParticleGameItem } from "editor@/common/gameStore/scene/action";
import { CombineReducer } from "editor@/common/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as _ from "lodash";
import Game from "ts@/kuni/lib/core";

let previewGame: null | Game = null;
let particleCotainer: any = null;
const ParticleEditor = (props: any) => {
  const dispatch = useDispatch();
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const currentGameItem = useSelector(
    (store: CombineReducer) => store.sceneReducer.gameItem
  );

  const { type } = props;
  const game = useSelector((store: CombineReducer) => store.sceneReducer.game);

  useEffect(() => {
    const previewParticleDom: any = document.getElementById("previewParticle");
    if (!previewGame) {
      const dpr = window.devicePixelRatio;
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
      particleCotainer = previewGame.add.group(
        "particleEditorGroup",
        previewGame.world
      );
      particleCotainer.position.set(previewGame.editX, previewGame.editY);
    } else {
      previewGame.stage.removeChildren();
    }
  }, []);

  const generateParticle = (target) => {
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
