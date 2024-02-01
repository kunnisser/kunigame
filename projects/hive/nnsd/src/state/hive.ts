// 场景映射配置
import Start from "./start/scene";
import Welcome from "./welcome/scene";
import Ast from "./ast/scene";
import Card from "./card/scene";

const StateHiveKey = {
  Welcome: Welcome,
  Start: Start,
  Ast: Ast,
  Card
};

const StateHive = (game) => {
  const hive = {};
  for (let key in StateHiveKey) {
    hive[key] = game.sceneManager.addScene(key, StateHiveKey[key]);
  }
  return hive;
};

export default StateHive;
