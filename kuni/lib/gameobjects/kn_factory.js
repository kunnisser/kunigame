/**
* KnFactory 是一个快速构建大量公用游戏对象的类
* 其创建的对象会自动添加到对应的Manager, World或者是自定义组中
* @class KnFactory
* @constructor
* @param {Core} game - 当前运行的游戏实例的引用	
*/

import KnSceneManager from '@/lib/gameobjects/kn_scene_manager';
import KnGroup from '@/lib/gameobjects/kn_group';

class KnFactory {
	constructor (game) {
		this.game = game;
	}

	group (key, parent) {
		return new KnGroup(key, parent);
	}

}

export default KnFactory;