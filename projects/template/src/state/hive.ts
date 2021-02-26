// 场景映射配置
import Preloader from 'ts@/kuni/lib/loader/kn_preloader';
import Welcome from './welcome/scene';

const StateHiveKey = {
  global_preloader: Preloader,
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