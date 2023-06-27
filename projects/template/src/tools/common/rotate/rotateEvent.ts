/*
 * @Author: kunnisser
 * @Date: 2023-06-26 11:04:24
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-06-27 10:52:13
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/rotate/rotateEvent.ts
 * @Description: ---- 旋转事件绑定 ----
 */

import { updateEditGameItem } from "editor@/common/gameStore/scene/action";
import Game from "ts@/kuni/lib/core";
import KnGraphics from "ts@/kuni/lib/gameobjects/kn_graphics";
import { math } from "ts@/kuni/lib/utils/common";
const initialRotate = (arrow: KnGraphics, game: Game) => {
  arrow.interactive = true;
  arrow.cursor = "pointer";
  let rotateFlag: boolean = false;
  let originAngle: number = 0;

  const completeRotate = () => {
    arrow.off("pointermove");
    rotateFlag = false;
    arrow.alpha = 1;
    const [currentGameItem] = game.redux.store.getState().sceneReducer.gameItem;
    const editGameItem = game.redux.store.getState().sceneReducer.editGameItem;
    editGameItem[currentGameItem.name] =
      editGameItem[currentGameItem.name] || {};
    editGameItem[currentGameItem.name].angle = currentGameItem.angle;
    // 撤销堆栈
    game.editorTools.recordOperationStep(
      [currentGameItem],
      (record: any, item: any) => {
        record.prev = {
          angle: originAngle
        };
        record.next = {
          angle: item.angle
        };
        return record;
      }
    );
    const cloneEditGameItem = Object.assign({}, editGameItem);
    game.redux.dispatch(updateEditGameItem(cloneEditGameItem));
  };

  arrow.off("pointerdown").on("pointerdown", () => {
    const [currentGameItem] = game.redux.store.getState().sceneReducer.gameItem;
    arrow.alpha = 0.5;
    rotateFlag = true;
    originAngle = currentGameItem.angle;
    arrow.on("pointermove", (event: any) => {
      if (!rotateFlag) {
        return;
      }
      const [x, y] = game.coverMask.translateWheelScalePosition(event);
      const angle =
        (math.angleBetweenPoints({ x: arrow.x, y: arrow.y }, { x, y }) /
          Math.PI) *
        180;
      arrow.angle = angle;
      currentGameItem.angle = angle;
      game.editorTools.rotateTool.onBoot([currentGameItem]);
    });
  });

  arrow.off("pointerup").on("pointerup", () => {
    completeRotate();
  });
  arrow.off("pointerupoutside").on("pointerupoutside", () => {
    completeRotate();
  });
};

export const RotateEvent = (arrow: KnGraphics, game: Game) => {
  initialRotate(arrow, game);
};
