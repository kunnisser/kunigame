
interface IMath {
  rdirect: Function // 随机正负1
  clamp: Function // 夹角范围数值
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