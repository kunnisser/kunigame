/*
 * @Author: kunnisser
 * @Date: 2023-03-16 16:55:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-03 09:25:18
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/modal/texturePicker.tsx
 * @Description: ---- 弹窗内容 - 纹理选择 ----
 */

import { Empty, Space } from "antd";
import React, { useContext, useEffect, useRef } from "react";
import Game from "ts@/kuni/lib/core";
import { WrapContext } from "editor@/page/wireboard";
import { setTimeout } from "timers";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";

const ModalTexturePicker = (props: any) => {
  const { atlasList, changeTexture, pickValue, currentScene } = props;
  const { closeModal }: any = useContext(WrapContext);
  const dpr = 2;
  const ref: any = useRef({
    atlasScreen: null,
    spritePool: currentScene.game.add.spritePool(),
    icons: [],
    texts: []
  });
  function onPointerOver(this: any) {
    this.alpha = 0.5;
  }

  function onPointerOverOut(this: any) {
    this.alpha = 1;
  }

  function onPointerDown(this: any) {
    const icon: KnSprite = this;
    const texture = icon.texture;
    changeTexture(texture);
    closeModal();
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
  }, []);

  useEffect(() => {
    const { atlasScreen, icons } = ref.current;
    // 回收icon
    ref.current.spritePool.releaseSprite(icons);
    for (const text of ref.current.texts) {
      // 清空文字对象及纹理缓存pixiid
      text.destroy(true);
    }
    ref.current.icons = [];
    ref.current.texts = [];
    atlasScreen.stage.removeChildren();

    // 内容渲染切换到微任务，减少卡顿
    setTimeout(() => {
      console.time("resourceRender");
      let screenHeight = 0;
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
        ref.current.texts.push(title);

        for (const frameKey of Object.keys(frames)) {
          if (i >= LINE_NUMBER) {
            i = 0;
            j++;
          }
          const icon = ref.current.spritePool.getSprite();
          const isNewCreatedTexture = !icon.texture.valid;
          icon.texture = PIXI.utils.TextureCache[frameKey];
          icon.anchor.set(0.5);

          const frameRatio =
            frames[frameKey].sourceSize.w / frames[frameKey].sourceSize.h;
          icon.width = frameRatio > 1 ? frameWidth : frameHeight * frameRatio;
          icon.height = frameRatio > 1 ? frameWidth / frameRatio : frameHeight;
          icon.x = 0.5 * frameWidth + i * (frameWidth + frameMarginRight);
          icon.y =
            screenHeight +
            0.5 * frameHeight +
            j * (frameHeight + frameMarginBottom);
          icon.tint =
            pickValue.textureCacheIds[0] === icon.texture.textureCacheIds[0]
              ? 0x32bf4c
              : 0xffffff;
          if (isNewCreatedTexture) {
            icon.interactive = true;
            icon.on("pointerover", onPointerOver, icon);
            icon.on("pointerout", onPointerOverOut, icon);
            icon.on("pointerdown", onPointerDown, icon);
          }

          atlasScreen.stage.addChild(icon);
          ref.current.icons.push(icon);
          const tip = atlasScreen.add.text(
            frameKey,
            frameKey,
            {
              fontSize: 12,
              fontWeight: "bold",
              fill: 0xffffff
            },
            [0.5, 0]
          );
          tip.x = icon.x;
          tip.y = icon.y + frameHeight * 0.5 + 10;
          atlasScreen.stage.addChild(tip);
          ref.current.texts.push(tip);
          i++;
        }
        screenHeight += atlasHeight;
      });
      atlasScreen.app.view.style.width = 768 + "px";
      atlasScreen.app.view.style.height = screenHeight + "px";
      atlasScreen.app.renderer.resize(768, screenHeight);
      console.timeEnd("resourceRender");
    }, 0);
  }, [pickValue, atlasList]);

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
