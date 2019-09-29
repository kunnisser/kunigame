/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:05 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-09-29 16:49:45
 */

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import KnGraphics from 'ts@/lib/gameobjects/kn_graphics';
import Game from 'ts@/lib/core';

class Home extends KnScene {
    public loadingTypes: Map<string, Function>;
    public loadingGp: PIXI.Container;
    public autoDisplay: Boolean;
    bg: PIXI.Sprite;
    drawStage: KnGraphics;
    constructor(game: Game, key: string, boot: boolean) {
        super(game, key, boot);
        this.game = game;
        this.resouces =  {
            run: './assets/data/loadingrun.json',
            blue: './assets/images/blue.png'
        };
    }

    boot() {
        this.create();
    }

    create() {
        console.log(123);
    }
}

export default Home;