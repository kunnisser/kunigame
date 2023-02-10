// 场景映射配置
import Start from "./start/scene";
import Welcome from "./welcome/scene";
// import Preloader from "ts@/kuni/lib/loader/kn_preloader";
const StateHiveKey = {
  Welcome: Welcome,
  Start: Start
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
