import Game from "ts@/kuni/lib/core";
import StateHive from "./src/state/hive";
import Config from "./schema/game.json";
const GameInitial = (view) => {
  const game = new Game({
    width: Config.width,
    ratio: Config.ratio,
    antialias: Config.antialias,
    transparent: Config.transparent,
    view
  });
  // 定义全局Mask
  const GameHive = StateHive(game);
  game.editHive = GameHive;

  // game.entryHive = GameHive["Welcome"];
  // game.sceneManager.dispatchEditScene(GameHive["Welcome"]);

  window["game"] = game;
  return game;
};

export default GameInitial;
