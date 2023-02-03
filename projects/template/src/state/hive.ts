// 场景映射配置
import Welcome from "./welcome/scene";

const StateHiveKey = {
  Welcome: Welcome
};

let StateHive = (game) => {
  let hive = {};
  for (let key in StateHiveKey) {
    hive[key] = game.sceneManager.addScene(key, StateHiveKey[key]);
  }
  return hive;
};

export default StateHive;
