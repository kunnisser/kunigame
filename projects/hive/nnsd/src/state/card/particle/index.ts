/*
 * @Author: kunnisser
 * @Date: 2024-02-16 01:17:59
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-05 17:33:52
 * @FilePath: /kunigame/projects/hive/nnsd/src/state/card/particle/index.ts
 * @Description: ---- 粒子特效 ----
 */

import Game from 'ts@/kuni/lib/core';
import KnEmitter from 'ts@/kuni/lib/gameobjects/kn_emitter';
import { KnTween } from 'ts@/kuni/lib/gameobjects/kn_tween';
import Don from '../cardcontent/role/player';

const cureEffectParticle = (game: Game, tween: KnTween) => {
  const emitter: KnEmitter = game.add.emitter(game, 10, 'treat');
  const cureEffectPlay: any = (target: Don) => {
    const particles = emitter.shootMulti(10);
    for (const particle of particles) {
      particle.x = game.math.redirect() * ~~(Math.random() * 10) * 8;
      particle.y = 0;
      tween.instance.to(particle, 0.6, {
        y: particle.y - Math.random() * 150,
        angle: 100 + game.math.redirect() * Math.random() * 360,
        alpha: 0,
        ease: tween.linear.easeNone,
      });
      const scaleRatio = Math.random() * 0.5;
      tween.instance.to(particle.scale, 0.6, {
        x: particle.scale.x * scaleRatio,
        y: particle.scale.y * scaleRatio,
        ease: tween.linear.easeNone,
      });
    }
  };
  return [emitter, cureEffectPlay];
};

export { cureEffectParticle };
