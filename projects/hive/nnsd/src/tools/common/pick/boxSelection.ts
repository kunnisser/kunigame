/*
 * @Author: kunnisser
 * @Date: 2023-04-27 10:30:17
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-04 10:55:12
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/pick/boxSelection.ts
 * @Description: ---- 框选功能 ----
 */

import Game from "ts@/kuni/lib/core";
import PickTool from ".";

const eventFormat = (x, y) => {
  return {
    data: {
      global: {
        x,
        y
      }
    }
  };
};

const drawBoxSelection = (pickTool: PickTool, positionArray: Array<number>) => {
  pickTool.pickBox.clear();
  pickTool.pickBox.lineStyle(2, 0x11b234);
  pickTool.pickBox.drawPolygon(positionArray);
};

export const boxSelection = (game: Game, pickTool: PickTool) => {
  const canvas: any = game.view.children[0];
  let [startX, startY, endX, endY] = [0, 0, 0, 0];
  canvas.onmousedown = (event: MouseEvent) => {
    const isPickType = game.editorTools.type === "pick";
    if (!isPickType) {
      return;
    }
    const [x, y] = game.coverMask.translateWheelScalePosition(
      eventFormat(event.offsetX, event.offsetY)
    );
    pickTool.isPulling = true;
    pickTool.pickBox.visible = true;
    startX = x;
    startY = y;
  };

  canvas.onmousemove = (event: MouseEvent) => {
    if (pickTool.isPulling) {
      const [x, y] = game.coverMask.translateWheelScalePosition(
        eventFormat(event.offsetX, event.offsetY)
      );
      endX = x;
      endY = y;

      const positionArray = [
        startX,
        startY,
        startX,
        endY,
        endX,
        endY,
        endX,
        startY
      ];
      console.log(positionArray);
      drawBoxSelection(pickTool, positionArray);
    }
  };

  canvas.onmouseup = (event: MouseEvent) => {
    if (!pickTool.isPulling) {
      return;
    }
    const test = game.currentScene.getChildByName("text1", true);
    console.log(pickTool.pickBox.getLocalBounds().contains(test.x, test.y));
    if (pickTool.pickBox.getLocalBounds().contains(test.x, test.y)) {
      game.editorTools.drawOperationComponent(test);
    }
    pickTool.isPulling = false;
    pickTool.pickBox.visible = false;
    pickTool.pickBox.clear();
  };
};
