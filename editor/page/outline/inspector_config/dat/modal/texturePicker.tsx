/*
 * @Author: kunnisser
 * @Date: 2023-03-16 16:55:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-21 17:43:50
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/modal/texturePicker.tsx
 * @Description: ---- 弹窗内容 - 纹理选择 ----
 */

import { Divider, Empty, Space } from "antd";
import React, { forwardRef, useContext, useEffect, useState } from "react";
import Game from "ts@/kuni/lib/core";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";
import { TextureContext } from "./pickerWrapper";

const ModalTexturePicker = forwardRef((props: any, ref: any) => {
  const { atlasList } = props;
  const { pickValue, setPickValue }: any = useContext(TextureContext);
  const [icons, setIcons] = useState([] as Array<KnSprite>);
  function onPointerOver(this: any) {
    this.alpha = 0.5;
  }

  function onPointerOverOut(this: any) {
    this.alpha = 1;
  }

  function onPointerDown(this: any) {
    const icon: any = this;
    setPickValue(icon.texture);
  }

  useEffect(() => {
    const iconArray: Array<KnSprite> = [];

    atlasList.map((atlas) => {
      const atlasDom = document.getElementById(atlas.key);
      const frames = atlas.frames;
      const LINE_NUMBER = 6;
      const framesNumber: number = Object.keys(frames).length;
      const frameMarginRight: number = 10;
      const frameMarginBottom: number = 40;
      const frameWidth: number = 120;
      const frameHeight: number = 120;
      const rows = Math.ceil(framesNumber / LINE_NUMBER);
      const dpr = window.devicePixelRatio;
      const atlasScreen = new Game({
        width: 768 / dpr,
        height: (rows * (frameHeight + frameMarginBottom)) / dpr,
        dpr: dpr,
        transparent: true,
        view: atlasDom,
        isPureCanvas: true
      });

      let i = 0;
      let j = 0;
      for (const frameKey of Object.keys(frames)) {
        if (i >= LINE_NUMBER) {
          i = 0;
          j++;
        }
        const icon = atlasScreen.add.image(
          frameKey,
          atlasScreen.stage,
          [0.5, 0.5]
        );
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
        icon.height = frameRatio > 1 ? frameWidth / frameRatio : frameHeight;
        icon.x = 0.5 * frameWidth + i * (frameWidth + frameMarginRight);
        icon.y = 0.5 * frameHeight + j * (frameHeight + frameMarginBottom);
        tip.x = icon.x;
        tip.y = icon.y + frameHeight * 0.5 + 10;
        icon.interactive = true;
        icon.on("pointerover", onPointerOver, icon);
        icon.on("pointerout", onPointerOverOut, icon);
        icon.on("pointerdown", onPointerDown, icon);
        icon.tint =
          pickValue.textureCacheIds[0] === icon.texture.textureCacheIds[0]
            ? 0x32bf4c
            : 0xffffff;
        iconArray.push(icon);
        i++;
      }
      return atlasScreen;
    });
    setIcons(iconArray);
  }, []);

  useEffect(() => {
    for (const icon of icons) {
      icon.tint =
        pickValue.textureCacheIds[0] === icon.texture.textureCacheIds[0]
          ? 0x32bf4c
          : 0xffffff;
    }
  }, [pickValue]);
  return (
    <>
      {atlasList && atlasList.length > 0 ? (
        <Space key={"modal-atlas-picker"} direction="vertical">
          {atlasList.map((atlas) => {
            return (
              <div key={atlas.key}>
                <Divider orientation="left">{atlas.key}</Divider>
                <div id={atlas.key}></div>
              </div>
            );
          })}
        </Space>
      ) : (
        <Empty></Empty>
      )}
    </>
  );
});

export default ModalTexturePicker;
