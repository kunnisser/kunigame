/*
 * @Author: kunnisser
 * @Date: 2023-02-10 16:24:18
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-15 17:21:12
 * @FilePath: /kunigame/projects/hive/nnsd/src/tools/common/drag/dragEvent.ts
 * @Description: ---- 绑定移动事件 ----
 */

import DragPosition from ".";

/**
 * @description: 激活绑定移动相关事件
 * @param {DragPosition} dragContext
 * @return {*}
 */
export const freeMovePosition = (dragContext: DragPosition) => {
  // 当前点击的对象
  let dragTarget: any = null;

  // 绑定移动控件的拖动事件
  const centerPointer = dragContext.anchorHandler;
  centerPointer.interactive = true;
  centerPointer.cursor = "pointer";
  centerPointer.on("pointerdown", startDragMove, centerPointer);

  const xAxisHandler = dragContext.anchorArrowX;
  xAxisHandler.interactive = true;
  xAxisHandler.cursor = "pointer";
  xAxisHandler.on("pointerdown", startDragMove, xAxisHandler);

  const yAxisHandler = dragContext.anchorArrowY;
  yAxisHandler.interactive = true;
  yAxisHandler.cursor = "pointer";
  yAxisHandler.on("pointerdown", startDragMove, yAxisHandler);

  // 定义解绑触发事件
  dragContext.game.stage.on("pointerup", dragEnd);
  dragContext.game.stage.on("pointerupoutside", dragEnd);
  document.addEventListener("keyup", (e) => {
    e.key === "Escape" && (dragContext.moveGroup.visible = false);
  });

  /**
   * @description: 自由移动提示工具及目标的坐标
   * @param {any} this 对应场景的上下文
   * @param {any} event 点击事件
   * @return {*}
   */
  function onDragMove(event: any) {
    const { moveGroup, game, bootTarget } = dragContext;
    if (moveGroup) {
      const [x, y] = game.coverMask.translateWheelScalePosition(event);
      if (dragTarget.id === "handler") {
        moveGroup.position.set(x, y);
        bootTarget.position.set(x, y);
      }
      dragTarget.id === "xAxis" && ((moveGroup.x = x), (bootTarget.x = x));
      dragTarget.id === "yAxis" && ((moveGroup.y = y), (bootTarget.y = y));
    }
  }

  /**
   * @description: 按下后开始移动事件
   * @param {any} this
   * @return {*}
   */
  function startDragMove(this: any) {
    dragTarget = this;
    if (dragTarget) {
      dragTarget.alpha = 0.75;
      dragTarget.on("pointermove", onDragMove, dragTarget);
    }
  }

  /**
   * @description: 停止移动事件
   * @param {*}
   * @return {*}
   */
  function dragEnd() {
    if (dragTarget) {
      dragTarget.alpha = 1;
      dragTarget.off("pointermove", onDragMove);
    }
  }
};
