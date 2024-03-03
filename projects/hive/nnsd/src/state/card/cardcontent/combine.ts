/*
 * @Author: kunnisser
 * @Date: 2024-02-02 17:26:23
 * @LastEditors: kunnisser
 * @LastEditTime: 2024-03-03 23:50:02
 * @FilePath: \kunigame\projects\hive\nnsd\src\state\card\cardcontent\combine.ts
 * @Description: ---- 卡牌内容集合 ----
 */

import DragonAoGang from './master/dragon/sprite';
import Mobs from './mobs';
import Druid from './mobs/druid';
import Fruit from './resource/fruit';
import Don from './role/player';

export const CardContentMap = {
  don: Don,
  mobs: Mobs,
  fruit: Fruit,
  druid: Druid,
  dragon: DragonAoGang
};

// 加权随机生成野怪卡片
class WeightedRandomGenerator { 
  public weightsOptions: {}
  public weightsNames: Array<string>;
  public weightsValues: Array<number>;
  constructor() {
    this.weightsOptions = {
      mobs: 10,
      fruit: 8,
      druid: 5,
      dragon: 2
    };
    this.initialSetting();
  }

  initialSetting() { 
    this.weightsNames = Object.keys(this.weightsOptions);
    this.weightsValues = Object.values(this.weightsOptions);
  }

  // 设置权重
  setWeights(name: string, value: number) {
    if (this.weightsOptions[name] !== void 0) { 
      const currentWeight: number = this.weightsOptions[name] + value;
      this.weightsOptions[name] = currentWeight < 0 ? 0 : currentWeight;
    }
    return this;
   }

  // 随机权重执行
  random() { 
    this.initialSetting();
    const cumulativeWeights: Array<number> = [];
    let sum: number = 0;
    for (const weight of this.weightsValues) { 
      sum += weight;
      cumulativeWeights.push(sum);
    }
    const currentRandomValue = Math.random() * sum;  // [0, sum)
    const rollIndex: number = cumulativeWeights.findIndex((weight: number) => weight > currentRandomValue);
    return this.weightsNames[rollIndex];
  }


  randomMultiple(length: number) { 
    return Array(length).fill(this.random());
  }
  
}

export default WeightedRandomGenerator;