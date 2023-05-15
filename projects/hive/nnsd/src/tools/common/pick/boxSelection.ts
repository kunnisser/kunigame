/*
 * @Author: kunnisser
 * @Date: 2023-04-27 10:30:17
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-15 17:27:45
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/pick/boxSelection.ts
 * @Description: ---- 框选功能 ----
 */

import Game from "ts@/kuni/lib/core";
import PickTool from ".";

// 将canvas的坐标转为pixi的事件坐标
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

// 绘制绿色的选择框
const drawBoxSelection = (pickTool: PickTool, positionArray: Array<number>) => {
  pickTool.pickBox.clear();
  pickTool.pickBox.lineStyle(2, 0x11b234);
  pickTool.pickBox.drawPolygon(positionArray);
};

// 判断other的矩形边界包含在rect的矩形边界中
const rectBoundsContains = (rect, other): Boolean => {
  if (other.width <= 0 || other.height <= 0) {
    return (
      other.x > rect.x &&
      other.y > rect.y &&
      other.right < rect.right &&
      other.bottom < rect.bottom
    );
  }
  return (
    other.x >= rect.x &&
    other.y >= rect.y &&
    other.right <= rect.right &&
    other.bottom <= rect.bottom
  );
};

// 获取文字对象的bounds信息，bounds的localBounds坐标会根据scale变化缩放，见KnText的factory
const getItemDprBounds = (item) => {
  const localBounds = item.getLocalBounds();
  const x = localBounds.x * item.scale.x + item.x;
  const y = localBounds.y * item.scale.y + item.y;
  return {
    x,
    y,
    right: x + item.width,
    bottom: y + item.height
  };
};

// 获取对象的bounds信息，叠加对象的坐标
const getItemBounds = (item) => {
  const localBounds = item.getLocalBounds();
  const x = localBounds.x + item.x;
  const y = localBounds.y + item.y;
  return {
    x,
    y,
    right: x + item.width,
    bottom: y + item.height
  };
};

// 遍历非KnGroup的对象
const recursionItems = (items: Array<any>, ret: Array<any>) => {
  items.map((item: any) => {
    if (item.constructor.name === "KnGroup") {
      recursionItems(item.children, ret);
    } else {
      ret.push(item);
    }
  });
  return ret;
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
      drawBoxSelection(pickTool, positionArray);
      pickTool.isMovingAbleCount++;
    }
  };

  canvas.onmouseup = (event: MouseEvent) => {
    if (!pickTool.isPulling) {
      return;
    }
    const childrenWithoutGroup = recursionItems(game.currentScene.children, []);
    childrenWithoutGroup.map((child: any) => {
      const isKnText = child.constructor.name === "KnText";
      if (
        rectBoundsContains(
          pickTool.pickBox.getLocalBounds(),
          isKnText ? getItemDprBounds(child) : getItemBounds(child)
        )
      ) {
        game.editorTools.drawOperationComponent(child);
      }
    });

    pickTool.isPulling = false;
    pickTool.pickBox.visible = false;
    pickTool.pickBox.clear();
    pickTool.isMovingAbleCount = 0;
  };
};
