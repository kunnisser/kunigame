import Game from "ts@/kuni/lib/core";
import StateHive from "./src/state/hive";
import Config from "./schema/game.json";
const GameInitial = (view) => {
  const game = new Game({
    width: view.clientWidth * window.devicePixelRatio * 2, // Config.width,
    ratio: view.clientWidth / view.clientHeight, // Config.ratio,
    antialias: Config.antialias,
    transparent: Config.transparent,
    view,
    editorWidth: Config.width,
    editorHeight: Config.width / Config.ratio
  });
  // 定义全局Mask
  const GameHive = StateHive(game);
  game.editHive = GameHive;

  // game.entryHive = GameHive["Welcome"];
  // game.sceneManager.dispatchEditScene(GameHive["Welcome"]);

  return game;
};

export default GameInitial;
