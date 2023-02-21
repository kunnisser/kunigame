/*
 * @Author: kunnisser
 * @Date: 2023-02-10 16:24:18
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-21 17:29:43
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

  // 定义拖拽撤销功能
  document.addEventListener("keydown", (e) => {
    const currentSceneId = dragContext.game.currentScene.id;
    const currentActionStack = dragContext.actionStack[currentSceneId];
    if (
      currentActionStack &&
      currentActionStack.length > 0 &&
      e.key === "z" &&
      (e.ctrlKey || e.metaKey)
    ) {
      const prevAction = currentActionStack.pop();
      if (prevAction) {
        const { moveGroup, relativeX, relativeY } = dragContext;
        const { x, y } = prevAction?.position;
        prevAction?.target.position.set(x - relativeX, y - relativeY);
        console.log(dragContext);
        moveGroup.position.set(x, y);
      }
    }
  });

  /**
   * @description: 自由移动提示工具及目标的坐标
   * @param {any} this 对应场景的上下文
   * @param {any} event 点击事件
   * @return {*}
   */
  function onDragMove(event: any) {
    const { moveGroup, game, bootTarget, relativeX, relativeY } = dragContext;
    if (moveGroup) {
      const [x, y] = game.coverMask.translateWheelScalePosition(event);
      if (dragTarget.id === "handler") {
        moveGroup.position.set(x, y);
        bootTarget.position.set(x - relativeX, y - relativeY); // 画布内对象还原为相对坐标
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
      const bootTarget = dragContext.bootTarget;
      const bootTargetPosition = dragContext.bootTarget.position;
      const currentSceneId = dragContext.game.currentScene.id;
      // 对操作栈插入拖拽前的数据
      dragContext.actionStack[currentSceneId].push({
        position: { x: bootTargetPosition.x, y: bootTargetPosition.y },
        target: bootTarget
      });
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
