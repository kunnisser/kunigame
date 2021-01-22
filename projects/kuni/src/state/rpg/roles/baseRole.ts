import KnGroup from "ts@/kuni/lib/gameobjects/kn_group";
import KnScene from "ts@/kuni/lib/gameobjects/kn_scene";
import * as dragonBones from '../../../../lib/utils/dragonbones';

class BaseRole extends KnGroup {
  public parent: KnScene | KnGroup;
  public role: any;
  public size: number;
  public name: string; // 角色名称
  public DB: any;
  constructor(game, parent, res, name) {
    super(game, 'baseRole', parent);
    this.game = game;
    this.parent = parent;
    this.name = name;
    this.size = 64;
    this.roleGenerator(res);
    this.roleResize();
  }

  roleGenerator(res) {
    this.DB = dragonBones;
    const factory = this.DB.PixiFactory.factory;
    factory.parseDragonBonesData(res[`${this.name}_ske`].data);
    factory.parseTextureAtlasData(res[`${this.name}_tex`].data, res[`${this.name}`].texture);
    this.role = factory.buildArmatureDisplay(this.name);
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
    this.height = this.size;
  }
}

export default BaseRole;