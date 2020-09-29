// 场景映射配置
import Home from 'ts@/src/state/home';
import Loading from 'ts@/src/state/loading';
import MapDemo from 'ts@/src/state/rpg/mapDemo';
import CursorDemo from 'ts@/src/state/cursorDemo';
import Environment from 'ts@/src/state/environment';
import TweenDemo from 'ts@/src/state/tweenDemo';
import UIDemo from 'ts@/src/state/uiDemo';
import LaserDemo from 'ts@/src/state/laser';
import KuaFu from 'ts@/src/state/kuafu/kuafu';
import Preloader from 'ts@/lib/loader/kn_preloader';

const StateHiveKey = {
  global_preloader: Preloader,
  home: Home,
  loading: Loading,
  mapdemo: MapDemo,
  cursordemo: CursorDemo,
  envdemo: Environment,
  tweendemo: TweenDemo,
  uidemo: UIDemo,
  laserdemo: LaserDemo,
  kuafu: KuaFu
};

let StateHive = (game) => {
  let hive = {};
  for (let key in StateHiveKey) {
    hive[key] = game.sceneManager.addScene(key, StateHiveKey[key]);
  }
  return hive;
};

export default StateHive;