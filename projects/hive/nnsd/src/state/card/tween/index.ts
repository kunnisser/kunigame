/*
 * @Author: kunnisser
 * @Date: 2024-02-05 14:44:41
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-02-14 17:30:31
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/tween/index.ts
 * @Description: ---- 缓动动画 ----
 */

import { KnTween } from 'ts@/kuni/lib/gameobjects/kn_tween';
import CheckerCardWrap from '../checkerboard/checkerCard';
import KnBitMapText from 'ts@/kuni/lib/gameobjects/kn_bitmap_text';

const moveCardTween = (
  tween: KnTween,
  target: CheckerCardWrap,
  pos: { x: number; y: number },
  cb?: Function
) => {
  return tween.instance.to(target, 0.35, {
    x: pos.x,
    y: pos.y,
    ease: tween.cubic.easeOut,
    onComplete: cb,
  });
};

const generateCardTween = (
  tween: KnTween,
  target: CheckerCardWrap,
  cb?: Function
) => {
  return tween.instance.to(target.scale, 0.35, {
    x: 1,
    y: 1,
    ease: tween.back.easeOut,
    onComplete: cb,
  });
};

const textUpdateTween = (tween: KnTween, text: KnBitMapText) => {
  return tween.instance.to(text.scale, 0.15, {
    x: 1.25,
    y: 0.75,
    ease: tween.linear.None,
    onComplete: () => {
      tween.instance.to(text.scale, 0.2, {
        x: 1,
        y: 1,
        ease: tween.back.easeOut,
      });
    },
  });
};

// const destroyCardTween = (
//   tween: KnTween,
//   target: CheckerCardWrap,
//   cb?: Function
// ) => {
//   return tween.instance.to(target.scale, 0.1, {
//     x: 0,
//     y: 0,
//     ease: tween.cubic.easeOut,
//     onComplete: cb,
//   });
// };

export { moveCardTween, generateCardTween, textUpdateTween };
