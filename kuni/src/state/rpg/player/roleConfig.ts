/*
英雄种类
@param name 【role名称】
@param speed 【射速】
@param bullet 【子弹】
@param hp 【血量】
@param mp 【蓝量】
@param skills 【技能】
@param attack 【攻击范围】
@param crit 【暴击率】
@param critVal 【暴击值】
*/

import { math } from 'ts@/lib/utils/common';

// 普通攻击Action
const normalHit = (attack, crit, critVal, target) => {
  const originAttack = math.between(attack);
  target.tip.hurtVal = math.crit(originAttack, crit, critVal);
}

const druid = {
  name: 'druid',
  remote: {
    bullet: 'druid_bullet',
    speed: 10
  },
  hp: 100,
  mp: 200,
  crit: 20,
  critVal: 100,
  skills: [
    {
      type: 'normal',
      name: '普通攻击',
      cd: 1,
      animate: 'sk_attack',
      icon: 'rpg_druid_weapon',
      distance: 4,
      attack: [20, 50],
      action: normalHit
    },
    {
      type: 'skill',
      name: '治疗',
      desc: '治疗300点生命',
      cd: 3,
      animate: 'sk_cure',
      icon: 'druid_sk_cure',
      distance: 1,
      action: () => {}
    }
  ]
};

export {druid};