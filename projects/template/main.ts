import Game from "ts@/kuni/lib/core";
import StateHive from "./src/state/hive";
import Config from "./schema/game.json";
const GameInitial = (view) => {
  const dpr = window.devicePixelRatio;
  console.log(view.clientWidth * dpr * 2);
  const game = new Game({
    width: view.clientWidth * dpr * 2, // Config.width,
    ratio: view.clientWidth / view.clientHeight, // Config.ratio,
    dpr: dpr,
    antialias: Config.antialias,
    transparent: Config.transparent,
    view,
    editorWidth: Config.width,
    editorHeight: Config.width / Config.ratio
  });
  // 定义全局Mask
  const GameHive = StateHive(game);
  game.hive = GameHive;

  // game.entryHive = GameHive["Welcome"];
  // game.sceneManager.dispatchEditScene(GameHive["Welcome"]);

  return game;
};

export default GameInitial;
