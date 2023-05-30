/*
 * @Author: kunnisser
 * @Date: 2023-02-10 16:24:18
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-30 14:11:36
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/drag/dragEvent.ts
 * @Description: ---- 绑定移动事件 ----
 */

import { updateEditGameItem } from "editor@/common/gameStore/scene/action";
import DragPosition from ".";

/**
 * @description: 激活绑定移动相关事件
 * @param {DragPosition} dragContext DragPosition 实例
 * @return {*}
 */

export const freeMovePosition = (dragContext: DragPosition) => {
  // 当前点击的对象
  let dragTarget: any = null;

  // 绑定移动控件的拖动事件
  const centerPointer = dragContext.anchorHandler;
  centerPointer.interactive = true;
  centerPointer.cursor = "pointer";
  centerPointer
    .off("pointerdown")
    .on("pointerdown", startDragMove, centerPointer);

  const xAxisHandler = dragContext.anchorArrowX;
  xAxisHandler.interactive = true;
  xAxisHandler.cursor = "pointer";
  xAxisHandler
    .off("pointerdown")
    .on("pointerdown", startDragMove, xAxisHandler);

  const yAxisHandler = dragContext.anchorArrowY;
  yAxisHandler.interactive = true;
  yAxisHandler.cursor = "pointer";
  yAxisHandler
    .off("pointerdown")
    .on("pointerdown", startDragMove, yAxisHandler);

  // 定义解绑触发事件
  dragContext.game.stage.off("pointerup").on("pointerup", dragEnd);
  dragContext.game.stage
    .off("pointerupoutside")
    .on("pointerupoutside", dragEnd);

  /**
   * @description: 自由移动提示工具及目标的坐标
   * @param {any} this 对应场景的上下文
   * @param {any} event 点击事件
   * @return {*}
   */
  function onDragMove(event: any) {
    const { moveGroup, game, bootTarget } = dragContext;
    const { relativeX, relativeY } = game.editorTools;
    if (moveGroup) {
      const [x, y] = game.coverMask.translateWheelScalePosition(event);
      if (dragTarget.id === "handler") {
        moveGroup.position.set(x, y);
        bootTarget.position.set(x - relativeX, y - relativeY); // 画布内对象还原为相对坐标
      }
      dragTarget.id === "xAxis" &&
        ((moveGroup.x = x), (bootTarget.x = x - relativeX));
      dragTarget.id === "yAxis" &&
        ((moveGroup.y = y), (bootTarget.y = y - relativeY));
    }
  }

  /**
   * @description: 按下后开始移动事件
   * @param {any} this 绑定拖动的目标，例如 拖动控件的部件
   * @return {*}
   */
  function startDragMove(this: any) {
    dragTarget = this;
    if (dragTarget) {
      dragTarget.alpha = 0.75;
      dragTarget.off("pointermove").on("pointermove", onDragMove, dragTarget);
      const bootTargetPosition = dragContext.bootTarget.position;

      dragContext.dragStartX = bootTargetPosition.x;
      dragContext.dragStartY = bootTargetPosition.y;
    }
  }

  /**
   * @description: 停止移动事件
   * @param {*}
   * @return {*}
   */
  function dragEnd() {
    if (dragTarget) {
      dragTarget.off("pointermove", onDragMove);

      if (dragTarget.alpha === 1) {
        return;
      }
      // 对操作栈插入拖拽前的数据
      const bootTarget = dragContext.bootTarget;
      const bootTargetPosition = dragContext.bootTarget.position;

      // 撤销堆栈
      dragContext.game.currentScene.cancelActionStack.push({
        position: [
          {
            prevX: dragContext.dragStartX,
            prevY: dragContext.dragStartY,
            nextX: bootTargetPosition.x,
            nextY: bootTargetPosition.y
          }
        ],
        target: [bootTarget],
        type: dragContext.game.editorTools.type
      });

      // 添加到编辑记录
      const game = dragContext.game;
      const editGameItem =
        game.redux.store.getState().sceneReducer.editGameItem;
      editGameItem[bootTarget.id] = editGameItem[bootTarget.id] || {};
      editGameItem[bootTarget.id].x = bootTargetPosition.x;
      editGameItem[bootTarget.id].y = bootTargetPosition.y;
      const cloneEditGameItem = Object.assign({}, editGameItem);
      game.redux.dispatch(updateEditGameItem(cloneEditGameItem));
      dragTarget.alpha = 1;
    }
  }
};
