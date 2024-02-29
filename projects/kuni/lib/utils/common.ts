import Game from '../core';
import { Graphics, Container, Sprite } from 'pixi.js';
import * as _ from 'lodash';
// 防抖函数
const debounce: any = {
  tick: null,
  handler: (next: Function, delay?: number) => {
    if (debounce.tick) {
      clearTimeout(debounce.tick);
    }
    debounce.tick = setTimeout(() => {
      next();
    }, delay || 200);
  },
};

// 节流降帧
const Throtte = (fps: number, elapsedMS: number, next: Function) => {
  Throtte['origin'] === void 0 && (Throtte['origin'] = 0);
  const bootMs = (60 / fps) * elapsedMS;
  if (Throtte['origin'] >= bootMs) {
    Throtte['origin'] = 0;
    next();
  } else {
    Throtte['origin'] += elapsedMS;
  }
};

// 代理事件
const events: IEvents = {
  reset() {
    events['valve'] && (events['valve'] = null);
  },
  addOnce(next: Function) {
    if (!events['valve']) {
      events['valve'] = true;
      return next();
    }
  },
};

// 数学函数类
const math: IMath = {
  redirect() {
    return Math.random() * 100 < 50 ? 1 : -1;
  },
  between(range) {
    return range[0] + Math.floor(Math.random() * (range[1] - range[0]));
  },
  crit(val, crit, critVal) {
    // 暂用
    return Math.floor(Math.random() * 100) < crit
      ? Math.round(val * (1 + critVal / 100))
      : val;
  },
  clamp(v: number, min: number, max: number) {
    if (v <= min) {
      return min;
    } else if (max <= v) {
      return max;
    } else {
      return v;
    }
  },
  angleToPointer(source, parent, target) {
    if (parent) {
      const sourcePos = parent.toGlobal(source.position);
      return Math.atan2(sourcePos.y - target.y, sourcePos.x - target.x);
    } else {
      return Math.atan2(source.y - target.y, source.x - target.x);
    }
  },
  angleBetweenPoints(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  },
};

const distance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
};

const computedAngleToPointer = (x, y, angle) => {
  const rotate = (Math.PI * angle) / 180;
  return [
    x * Math.cos(rotate) - y * Math.sin(rotate),
    x * Math.sin(rotate) + y * Math.cos(rotate),
  ];
};
const rotatePointers = (paths, angle) => {
  const [x1, y1, x2, y2, x3, y3, x4, y4] = paths;
  const pointer1 = computedAngleToPointer(x1, y1, angle);
  const pointer2 = computedAngleToPointer(x2, y2, angle);
  const pointer3 = computedAngleToPointer(x3, y3, angle);
  const pointer4 = computedAngleToPointer(x4, y4, angle);
  return [...pointer1, ...pointer2, ...pointer3, ...pointer4];
};

/* 纹理精灵图 */

const TransformImage = {
  // 形状转纹理
  transformToTexture: (game: Game, graphics: Graphics) => {
    return game.app.renderer.generateTexture(
      graphics,
      1,
      window.devicePixelRatio
    );
  },
  // 形状转Sprite
  transformToSprite: (game: Game, graphics: Graphics, parent: Container) => {
    const texture = TransformImage.transformToTexture(game, graphics);
    const sprite: Sprite = new Sprite(texture);
    parent.addChild(sprite);
    return sprite;
  },
};

// 古代时间转换
const TransformAncientDate = {
  generate(prefix: string = '') {
    let cnStr = ['十', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let days: Array<string> = [];
    for (let i = 1, l = 30; i <= l; i++) {
      if (i <= 10) {
        days.push(`${prefix}${cnStr[i % 10]}`);
      } else if (i > 10 && i < 20) {
        days.push(`${cnStr[0]}${cnStr[i % 10]}`);
      } else {
        days.push(
          `${cnStr[~~(i / 10)]}${
            i % 10 > 0 ? cnStr[0] + cnStr[i % 10] : cnStr[0]
          }`
        );
      }
    }
    return days;
  },
  transform(dayStamp) {
    const year = ~~(dayStamp / 360);
    let rest = dayStamp % 360;
    const month = ~~(rest / 30);
    rest = rest % 30;
    return [year, month, rest];
  },
  toString(gameDate, resArr) {
    const settingString = TransformAncientDate.generate('');
    const settingStringPrefix = TransformAncientDate.generate('初');
    return [
      `${gameDate.year[0]} ${
        resArr[0] === 0 ? '元' : settingString[resArr[0] - 1]
      }年`,
      `${settingString[resArr[1]]}月`,
      `${settingStringPrefix[resArr[2]]}`,
    ];
  },
  getSeason(gameDate, month) {
    const seasonType = ~~(month / 3);
    const seasonArr: any[] = [
      seasonType as number,
      gameDate.season[seasonType] as string,
    ];
    return seasonArr;
  },
  getWeather(gameDate, month: number) {
    const seasonIndex = ~~(month / 3);
    const power = month % 3;
    const weatherTypes = gameDate.weather; // 0: 雨 / 落花瓣， 1：晴 -> 阳光由弱变强， 2： 落叶 3： 小雪 -> 大雪
    return [weatherTypes[seasonIndex], power];
  },
};

// 自定义game对象拷贝
const createFrom = (target: any, game: Game) => {
  const type = target.constructor.name;
  const typeMap = {
    KnGroup: () => game.add.group(target.key),
    KnText: () =>
      game.add.text(target.id, target.text, target.style, [
        target.anchor.x,
        target.anchor.y,
      ]),
    KnSprite: () =>
      game.add.sprite(target.name, target.id, [
        target.anchor.x,
        target.anchor.y,
      ]),
    KnBackGround: () => game.add.background(target.name, target.id),
    KnBitMapText: () =>
      game.add.bitmapText(
        target.id,
        target.text,
        {
          fontSize: target.fontSize,
          fontName: target.fontName,
        },
        [target.anchor.x, target.anchor.y]
      ),
  };
  const cloneEntity = typeMap[type]();
  const keys = [
    'alpha',
    'visible',
    'renderable',
    'children',
    '_width',
    '_height',
    'style',
  ];
  keys.forEach((key) => {
    if (key !== 'transform') {
      cloneEntity[key] = target[key];
    }
  });
  const { x, y, scale, rotation, skew, pivot } = target;
  cloneEntity.setTransform(
    x,
    y,
    scale.x,
    scale.y,
    rotation,
    skew.x,
    skew.y,
    pivot.x,
    pivot.y
  );
  return cloneEntity;
};

const rem = (val: number): number => {
  return val * window['scale'];
}

export {
  debounce,
  math,
  events,
  TransformImage,
  Throtte,
  TransformAncientDate,
  distance,
  rotatePointers,
  createFrom,
  rem
};
