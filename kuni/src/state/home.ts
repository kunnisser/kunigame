/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:05 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-09-28 18:33:50
 */

import KnScene from 'ts@/lib/gameobjects/kn_scene';
import KnGraphics from 'ts@/lib/gameobjects/kn_graphics';
import Game from 'ts@/lib/core';
import {GuiScene} from 'ts@/lib/utils/gui';

class Home extends KnScene {
    public loadingTypes: Map<string, Function>;
    public ticker: PIXI.Ticker;
    public loadingGp: PIXI.Container;
    public autoDisplay: Boolean;
    bg: PIXI.Sprite;
    drawStage: KnGraphics;
    constructor(game: Game, key: string, boot: boolean) {
        super(game, key, boot);
        this.game = game;
        this.loadingTypes = new Map([
            ['home', this.boot],
            ['loading', this.gotoLoading],
            ['mapdemo', this.gotoMapDemo]
        ]);
        this.ticker = null;
    }

    boot() {
        this.dev();
        this.create();
    }

    dev() {
        const dat = new GuiScene();
        const gui = this.game.gui;
        const folder = gui.addFolder('场景');
        const selector = folder.add(dat, '场景选择', ['home', 'loading', 'mapdemo']);
        this.game.stats.showPanel(0);
        selector.onChange((v: string) => {
            this.loadingTypes.get(v).call(this);
        });
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