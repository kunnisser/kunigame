import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import Game from "ts@/kuni/lib/core";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";

/* 定义商队 */

class Caravan extends KnGroup {
  constructor(game: Game, parent: KnGroup | KnScene) {
    super(game, 'caravan', parent);
  }
}

export default Caravan;