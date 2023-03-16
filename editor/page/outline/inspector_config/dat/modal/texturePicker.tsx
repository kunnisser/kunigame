/*
 * @Author: kunnisser
 * @Date: 2023-03-16 16:55:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-16 17:32:38
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/modal/texturePicker.tsx
 * @Description: ---- 弹窗内容 - 纹理选择 ----
 */
import { Divider } from "antd";
import React, { useEffect } from "react";
import Game from "ts@/kuni/lib/core";
const ModalTexturePicker = (props) => {
  const { textureAbleList } = props;
  useEffect(() => {
    const atlas = document.getElementById("atlas");
    const atlasScreen = new Game({
      width: 800,
      ratio: 2,
      transparent: true,
      view: atlas,
      isPureCanvas: true
    });
    console.log(textureAbleList);
    atlasScreen.loader.add(textureAbleList[3].key, textureAbleList[3].url);
    atlasScreen.loader.load(() => {
      const temp = atlasScreen.add.image("loadingrun_02", atlasScreen.stage);
      temp.width = 100;
      temp.height = 100;
      temp.tint = 0xffffff;
      console.log(temp);
    });
    console.log(atlasScreen);
  }, []);
  return (
    <>
      <Divider orientation="left">已加载的图片资源</Divider>
      <Divider orientation="left">已加载的atlas</Divider>
      <div id="atlas"></div>
    </>
  );
};

export default ModalTexturePicker;
