import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Game from "ts@/kuni/lib/core";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";

/* 定义包裹 */

class Package extends KnGroup {
  constructor(game: Game, parent: KnGroup | KnScene) {
    super(game, 'package', parent);
  }
}

export default Package;