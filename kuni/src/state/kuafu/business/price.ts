interface IFarmPriceOptions {
  originPrice: number; // 原始价值
  season: number; // 季节 （春夏秋冬）
  weather: number; // 天气 （雨雪晴）
  stack: number; // 当地库存 正比系数 需求量大则存在
  incident?: string; // 事端影响
  hasBuilding: boolean; // 是否有对应的商店 （ 正比系数 ）
}

interface IWeaponPriceOptions {
  originPrice: number; // 原始价值
  incident?: string; // 事端影响
  hasBuilding: boolean; // 是否有对应的商店 （ 正比系数 ）
}

interface IPasturePriceOptions {
  originPrice: number; // 原始价值
  incident?: string; // 事端影响
  stack: number;
  hasBuilding: boolean; // 是否有对应的商店 （ 正比系数 ）
}

interface IOrePriceOptions {
  originPrice: number; // 原始价值
  incident?: string; // 事端影响
  gdp: number; // 受繁华程度正比
}

interface IGroceryPriceOptions {
  originPrice: number; // 原始价值
  incident?: string; // 事端影响
  gdp: number; // 受繁华程度正比
  stack: number;
  hasBuilding: boolean; // 是否有对应的商店 （ 正比系数 ）
}

const generateFarmPrice = (options: IFarmPriceOptions) => {
  let price = options.originPrice;
  return price;
}

const generateWeaponPrice = (options: IWeaponPriceOptions) => {
  let price = options.originPrice;
  return price;
}

const generatePasturePrice = (options: IPasturePriceOptions) => {

}

const generateOrePrice = (options: IOrePriceOptions) => {

}

const generateGroceryPrice = (options: IGroceryPriceOptions) => {

}

const PriceGenerator = {
  'farm': generateFarmPrice,
  'weapon': generateWeaponPrice,
  'pasture': generatePasturePrice,
  'ore': generateOrePrice,
  'grocery': generateGroceryPrice
}

export default PriceGenerator;