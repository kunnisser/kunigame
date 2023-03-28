/*
 * @Author: kunnisser
 * @Date: 2023-03-16 16:55:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-28 17:35:51
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/modal/texturePicker.tsx
 * @Description: ---- 弹窗内容 - 纹理选择 ----
 */

import { Empty, Space } from "antd";
import React, { useContext, useEffect, useRef } from "react";
import Game from "ts@/kuni/lib/core";
import { WrapContext } from "editor@/page/wireboard";

const ModalTexturePicker = (props: any) => {
  const { atlasList, changeTexture, pickValue } = props;
  const { closeModal }: any = useContext(WrapContext);
  const dpr = 2;
  const ref: any = useRef({
    atlasScreen: null,
    spritePool: null,
    icons: []
  });
  function onPointerOver(this: any) {
    this.alpha = 0.5;
  }

  function onPointerOverOut(this: any) {
    this.alpha = 1;
  }

  function onPointerDown(this: any) {
    const textureKey: any = this;
    const texture = PIXI.utils.TextureCache[textureKey];
    closeModal();
    changeTexture(texture);
  }

  useEffect(() => {
    const atlasDom = document.getElementById("atlas");
    ref.current.atlasScreen = new Game({
      width: 0,
      height: 0,
      dpr: dpr,
      transparent: true,
      view: atlasDom,
      isPureCanvas: true
    });
    PIXI.settings.GC_MODE = PIXI.GC_MODES.MANUAL;
    ref.current.spritePool = ref.current.atlasScreen.add.spritePool();
  }, []);

  useEffect(() => {
    const { atlasScreen } = ref.current;
    console.log(pickValue);
    // icons && ref.current.spritePool.releaseSprite(icons);
    const icons = atlasScreen.stage.getChildByName("icons");
    icons && icons.removeChildren();
    console.log(PIXI.utils.TextureCache);
    // 内容渲染切换到微任务，减少卡顿
    setTimeout(() => {
      let screenHeight = 0;
      if (ref.current.icons.length > 0) {
        ref.current.icons.map((icon) => {
          icon.tint =
            pickValue.textureCacheIds[0] === icon.texture.textureCacheIds[0]
              ? 0x32bf4c
              : 0xffffff;
          icons.addChild(icon);
        });
      } else {
        const iconGroup = atlasScreen.add.group("icons", atlasScreen.stage);
        atlasList.map((atlas) => {
          const frames = atlas.frames;
          const LINE_NUMBER = 6;
          const framesNumber: number = Object.keys(frames).length;
          const frameMarginRight: number = 10;
          const frameMarginBottom: number = 40;
          const frameWidth: number = 120;
          const frameHeight: number = 120;
          const rows = Math.ceil(framesNumber / LINE_NUMBER);
          const atlasHeight = rows * (frameHeight + frameMarginBottom);
          let i = 0;
          let j = 0;
          const title = atlasScreen.add.text(
            atlas.key,
            "- " + atlas.key + " -",
            {
              fontSize: 24,
              fontWeight: "bold",
              fill: 0x32bf4c,
              stroke: 0xbbf6bc,
              strokeThickness: 10
            },
            [0, 0]
          );
          title.position.set(0, screenHeight);
          screenHeight += title.height * 1.5;
          atlasScreen.stage.addChild(title);
          for (const frameKey of Object.keys(frames)) {
            if (i >= LINE_NUMBER) {
              i = 0;
              j++;
            }
            const icon = ref.current.spritePool.getSprite();
            icon.texture = PIXI.utils.TextureCache[frameKey];
            icon.anchor.set(0.5);
            iconGroup.addChild(icon);

            const tip = atlasScreen.add.text(
              frameKey,
              frameKey,
              {
                fontSize: 12,
                fontWeight: "bold"
              },
              [0.5, 0]
            );
            atlasScreen.stage.addChild(tip);
            const frameRatio =
              frames[frameKey].sourceSize.w / frames[frameKey].sourceSize.h;

            icon.width = frameRatio > 1 ? frameWidth : frameHeight * frameRatio;
            icon.height =
              frameRatio > 1 ? frameWidth / frameRatio : frameHeight;
            icon.x = 0.5 * frameWidth + i * (frameWidth + frameMarginRight);
            icon.y =
              screenHeight +
              0.5 * frameHeight +
              j * (frameHeight + frameMarginBottom);
            tip.x = icon.x;
            tip.y = icon.y + frameHeight * 0.5 + 10;
            icon.interactive = true;
            icon.on("pointerover", onPointerOver, icon);
            icon.on("pointerout", onPointerOverOut, icon);
            icon.on("pointerdown", onPointerDown, frameKey);
            icon.tint =
              pickValue.textureCacheIds[0] === icon.texture.textureCacheIds[0]
                ? 0x32bf4c
                : 0xffffff;
            ref.current.icons.push(icon);
            i++;
          }
          screenHeight += atlasHeight;
        });
        atlasScreen.app.view.style.width = 768 + "px";
        atlasScreen.app.view.style.height = screenHeight + "px";
        atlasScreen.app.renderer.resize(768, screenHeight);
      }
    }, 100);
  }, [pickValue, atlasList]);

  // const removeGameContext = (atlasScreens) => {
  //   for (let atlasScreen of atlasScreens) {
  //     if (!atlasScreen.app.renderer) {
  //       return;
  //     }
  //     atlasScreen.app.renderer.context.gl
  //       .getExtension("WEBGL_lose_context")
  //       .loseContext();
  //     atlasScreen.app.destroy(true, {
  //       children: true
  //     });
  //   }
  // };
  return (
    <>
      {atlasList && atlasList.length > 0 ? (
        <Space key={"modal-atlas-picker"} direction="vertical">
          <div id="atlas"></div>
        </Space>
      ) : (
        <Empty></Empty>
      )}
    </>
  );
};

export default ModalTexturePicker;
