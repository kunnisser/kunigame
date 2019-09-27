/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:05 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-09-27 17:50:06
 */

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import KnGraphics from 'ts@/lib/gameobjects/kn_graphics';
import Game from 'ts@/lib/core';

class Home extends KnScene {
    public loadingTypes: Map<string, Function>;
    public ticker: PIXI.Ticker;
    public loadingGp: PIXI.Container;
    public autoDisplay: Boolean;
    defaultGui: string;
    bg: PIXI.Sprite;
    drawStage: KnGraphics;
    constructor(game: Game, key: string, boot: boolean) {
        super(game, key, boot);
        this.game = game;
        this.loadingTypes = new Map([
            ['home', this.initialWorld],
            ['loading', this.gotoLoading],
            ['mapdemo', this.gotoMapDemo]
        ]);
        this.ticker = null;
        boot && this.initialWorld();
    }

    dev() {
        this.defaultGui = '';
        const dat = {
            'sceneType': this.defaultGui
        };
        const gui = this.game.gui;
        const selector = gui.add(dat, 'sceneType', ['', 'loading', 'mapdemo']);
        this.game.stats.showPanel(0);
        selector.onChange((v: string) => {
            this.loadingTypes.get(v).call(this);
        });
    }

    initialWorld() {
        this.dev();
        this.create();
    }

    create() {
    }

    // 進入地圖
    gotoLoading() {
        const targetScene = this.game.sceneManager.scenes[1];
        this.game.sceneManager.changeScene(this, targetScene);
    }

    // 進入地圖
    gotoMapDemo() {
        const targetScene = this.game.sceneManager.scenes[2];
        this.game.sceneManager.changeScene(this, targetScene);
    }
}

export default Home;