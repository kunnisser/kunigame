// 场景映射配置
import Start from "./start/scene";
import Welcome from "./welcome/scene";
import Ast from "./ast/scene";

const StateHiveKey = {
  Welcome: Welcome,
  Start: Start,
  Ast: Ast
};

const StateHive = (game) => {
  // game.sceneManager.addScene("global_preloader", Preloader);
  const hive = {};
  for (let key in StateHiveKey) {
    hive[key] = game.sceneManager.addScene(key, StateHiveKey[key]);
  }
  return hive;
};

export default StateHive;
