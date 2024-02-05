/*
 * @Author: kunnisser
 * @Date: 2024-02-05 14:44:41
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-05 17:37:23
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/tween/index.ts
 * @Description: ---- 缓动动画 ----
 */

import { KnTween } from 'ts@/kuni/lib/gameobjects/kn_tween';
import CheckerCardWrap from '../checkerboard/checkerCard';

const moveCardTween = (
  tween: KnTween,
  target: CheckerCardWrap,
  pos: { x: number; y: number }
) => {
  return tween.instance.to(target, 0.3, {
    x: pos.x,
    y: pos.y,
    ease: tween.linear.easeNone,
  });
};

const generateCardTween = (tween: KnTween, target: CheckerCardWrap) => {
  return tween.instance.to(target.scale, 0.2, {
    x: 1,
    y: 1,
    ease: tween.bounce.inOut,
  });
};

const destroyCardTween = (tween: KnTween, target: CheckerCardWrap) => {
  return tween.instance.to(target.scale, 0.2, {
    x: 0,
    y: 0,
    ease: tween.bounce.inOut,
    onComplete: () => {
      target.visible = false;
    },
  });
};

export { moveCardTween, generateCardTween, destroyCardTween };
