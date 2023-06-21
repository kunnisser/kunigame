/*
 * @Author: kunnisser
 * @Date: 2023-06-20 10:54:17
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-21 10:14:57
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/scale/scaleEvent.ts
 * @Description: ---- 绑定缩放事件 ----
 */

import { updateEditGameItem } from "editor@/common/gameStore/scene/action";
const SCALE_MODE_DEFAULT = 1;
const SCALE_MODE_X = 2;
const SCALE_MODE_Y = 3;

const initScaleEvent = (targets) => {
  for (const target of targets) {
    target.interactive = true;
    target.cursor = "pointer";
  }
};

const bindScaleEvent = (target, game, type) => {
  let originScaleX: number = 0;
  let originScaleY: number = 0;
  target.off("pointerdown").on("pointerdown", () => {
    target.alpha = 0.5;
    let storeFlag = false;
    let [originX, originY] = [0, 0];
    const [currentGameItem] = game.redux.store.getState().sceneReducer.gameItem;
    originScaleX = currentGameItem.scale.x;
    originScaleY = currentGameItem.scale.y;

    target.on("pointermove", (event: any) => {
      const [x, y] = game.coverMask.translateWheelScalePosition(event);
      storeFlag || ((originX = x), (originY = y), (storeFlag = true));
      const ratioScaleX =
        type === SCALE_MODE_Y
          ? originScaleX
          : originScaleX + (x - originX + (y - originY)) / 1000;
      const ratioScaleY =
        type === SCALE_MODE_X
          ? originScaleY
          : originScaleY + (x - originX + (y - originY)) / 1000;
      currentGameItem.scale.set(ratioScaleX, ratioScaleY);
      game.editorTools.scaleTool.onBoot([currentGameItem]);
    });
  });

  target.off("pointerup").on("pointerup", () => {
    target.off("pointermove");
    target.alpha = 1;
  });

  target.off("pointerupoutside").on("pointerupoutside", () => {
    target.off("pointermove");
    target.alpha = 1;
    const [currentGameItem] = game.redux.store.getState().sceneReducer.gameItem;
    const editGameItem = game.redux.store.getState().sceneReducer.editGameItem;
    editGameItem[currentGameItem.name] =
      editGameItem[currentGameItem.name] || {};
    editGameItem[currentGameItem.name].scale = {
      x: currentGameItem.scale.x,
      y: currentGameItem.scale.y
    };
    // 撤销堆栈
    game.editorTools.recordOperationStep(
      [currentGameItem],
      (record: any, item: any) => {
        record.prev = {
          scale: {
            x: originScaleX,
            y: originScaleY
          }
        };
        record.next = {
          scale: {
            x: item.scale.x,
            y: item.scale.y
          }
        };
        return record;
      }
    );
    const cloneEditGameItem = Object.assign({}, editGameItem);
    game.redux.dispatch(updateEditGameItem(cloneEditGameItem));
  });
};

export const scaleEvent = (scaleButton, scaleButtonX, scaleButtonY, game) => {
  initScaleEvent([scaleButton, scaleButtonX, scaleButtonY]);
  bindScaleEvent(scaleButton, game, SCALE_MODE_DEFAULT);
  bindScaleEvent(scaleButtonX, game, SCALE_MODE_X);
  bindScaleEvent(scaleButtonY, game, SCALE_MODE_Y);
};
