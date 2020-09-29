
interface IMath {
  redirect: Function // 随机正负1
  clamp: Function // 夹角范围数值
  angleToPointer: Function // 俩点的夹角
  between: Function // 数值范围
  crit: Function // 暴击算法（换伪随机）
}

interface IEvents {
  reset: Function // 重置状态
  addOnce: Function // 一次性事件
}

interface IBorder {
  width: number,
  color: number,
  alpha: number
}