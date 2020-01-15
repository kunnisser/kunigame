import KnGroup from "ts@/lib/gameobjects/kn_group";
import KnScene from "ts@/lib/gameobjects/kn_scene";

class NormalEnemy extends KnGroup{
  public parent: KnGroup | KnScene;
  constructor(game, parent) {
    super(game, 'normalMonster', parent);
    this.game = game;
    this.parent = parent;
    this.enemyGenerator();
  }

  enemyGenerator() {

  }
}

export default NormalEnemy;