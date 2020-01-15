import KnGroup from "ts@/lib/gameobjects/kn_group";
import Game from "ts@/lib/core";
import KnScene from "ts@/lib/gameobjects/kn_scene";

/* 定义包裹 */

class Package extends KnGroup{
  constructor(game: Game, parent: KnGroup | KnScene) {
    super(game, 'package', parent);
  }
}

export default Package;