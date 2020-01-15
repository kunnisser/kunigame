import KnGroup from "ts@/lib/gameobjects/kn_group";
import KnScene from "ts@/lib/gameobjects/kn_scene";
import * as dragonBones from '../../../../lib/utils/dragonbones';

class BaseRole extends KnGroup{
  public parent: KnScene | KnGroup;
  public role: any;
  public size: number;
  public pointer: Array<number>; // 角色坐标
  public DB: any;
  constructor(game, parent, res) {
    super(game, 'baseRole', parent);
    this.game = game;
    this.parent = parent;
    this.size = 64;
    this.roleGenerator(res);
    this.roleResize();
  }

  roleGenerator(res) {
    this.DB = dragonBones;
    const factory = this.DB.PixiFactory.factory;
    factory.parseDragonBonesData(res[0]);
    factory.parseTextureAtlasData(res[1], res[2]);
    this.role = factory.buildArmatureDisplay('druid');
    this.role.animation.play('stay');
    this.role.position.set(0, 32);
    this.addChild(this.role);
  }

  setFaceToRight() {
    this.role.scale.x === 1 &&
    this.role.scale.set(-1, 1);
  }

  setFaceToLeft() {
    this.role.scale.x === -1 &&
    this.role.scale.set(1, 1);
  }

  roleResize() {
    this.width = this.size;
    this.height =this.size;
  }
}

export default BaseRole;