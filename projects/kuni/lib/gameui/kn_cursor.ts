import KnGroup from 'ts@/kuni/lib/gameobjects/kn_group';
import Game from '../core';
class KnCursor extends KnGroup {
  public game: Game;
  constructor(game: Game, parent: PIXI.Container) {
    super(game, 'cursor', parent);
    this.game = game;
    const cssPath = [
      './assets/images/hand_cursor.png',
      './assets/images/attack.png'
    ];
    const handIcon = `url(${cssPath[0]}),auto`;
    const hoverIcon = `url(${cssPath[1]}),auto`;
    this.game.app.renderer.plugins.interaction.cursorStyles.default = handIcon;
    this.game.app.renderer.plugins.interaction.cursorStyles.hover = hoverIcon;
  }
}

export default KnCursor;