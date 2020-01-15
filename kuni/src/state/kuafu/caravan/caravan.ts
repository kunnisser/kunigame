import KnGroup from "ts@/lib/gameobjects/kn_group";
import Game from "ts@/lib/core";
import KnScene from "ts@/lib/gameobjects/kn_scene";

/* 定义商队 */

class Caravan extends KnGroup{
  constructor(game: Game, parent: KnGroup | KnScene) {
    super(game, 'caravan', parent);
  }
}

export default Caravan;