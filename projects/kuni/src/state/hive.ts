// 场景映射配置
import Home from 'ts@/kuni/src/state/home';
import Loading from 'ts@/kuni/src/state/loading';
import MapDemo from 'ts@/kuni/src/state/rpg/mapDemo';
import CursorDemo from 'ts@/kuni/src/state/cursorDemo';
import Environment from 'ts@/kuni/src/state/environment';
import TweenDemo from 'ts@/kuni/src/state/tweenDemo';
import UIDemo from 'ts@/kuni/src/state/uiDemo';
import LaserDemo from 'ts@/kuni/src/state/laser';
import KuaFu from 'ts@/kuni/src/state/kuafu/kuafu';
import Preloader from 'ts@/kuni/lib/loader/kn_preloader';
import Triangulation from 'ts@/kuni/src/state/postion';

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
  kuafu: KuaFu,
  Triangulation: Triangulation,
};

let StateHive = (game) => {
  let hive = {};
  for (let key in StateHiveKey) {
    hive[key] = game.sceneManager.addScene(key, StateHiveKey[key]);
  }
  return hive;
};

export default StateHive;