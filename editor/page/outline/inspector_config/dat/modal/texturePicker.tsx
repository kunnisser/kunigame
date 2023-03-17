/*
 * @Author: kunnisser
 * @Date: 2023-03-16 16:55:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-17 16:57:38
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/modal/texturePicker.tsx
 * @Description: ---- 弹窗内容 - 纹理选择 ----
 */
import { Badge, Divider } from "antd";
import React, { useEffect } from "react";
import Game from "ts@/kuni/lib/core";
const ModalTexturePicker = (props) => {
  const { atlas } = props;
  console.log(atlas);
  useEffect(() => {
    const atlasDom = document.getElementById(atlas.key);
    const frames = atlas.frames;
    console.log(frames);
    const LINE_NUMBER = 6;
    const framesNumber: number = Object.keys(frames).length;
    const frameMarginRight: number = 10;
    const frameMarginBottom: number = 10;
    const framesSample: any = Object.values(frames)[0];
    const frameRatio = framesSample.sourceSize.w / framesSample.sourceSize.h;
    const frameWidth: number = 120;
    const frameHeight: number = frameWidth / frameRatio;
    const rows = Math.ceil(framesNumber / LINE_NUMBER);

    const atlasScreen = new Game({
      width: 800,
      height: rows * (frameHeight + frameMarginBottom),
      dpr: 1,
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
      const temp = atlasScreen.add.image(frameKey, atlasScreen.stage);

      temp.width = frameWidth;
      temp.height = frameHeight;
      temp.x = i * (frameWidth + frameMarginRight);
      temp.y = j * (temp.height + frameMarginBottom);
      temp.tint = 0xffffff;
      i++;
    }
    console.log(atlasScreen);
  }, []);
  return (
    <>
      <Badge.Ribbon placement={"start"} text={atlas.key}>
        <div style={{ height: "30px" }}></div>
      </Badge.Ribbon>
      <div id={atlas.key}></div>
      <Divider />
    </>
  );
};

export default ModalTexturePicker;
