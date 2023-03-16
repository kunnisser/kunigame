/*
 * @Author: kunnisser
 * @Date: 2023-03-16 16:55:20
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-16 23:41:14
 * @FilePath: \kunigame\editor\page\outline\inspector_config\dat\modal\texturePicker.tsx
 * @Description: ---- 弹窗内容 - 纹理选择 ----
 */
import { Divider } from "antd";
import React, { useEffect } from "react";
import Game from "ts@/kuni/lib/core";
const ModalTexturePicker = (props) => {
  const { textureAbleList } = props;
  console.log(textureAbleList);
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
    for (const atlas of textureAbleList) {
      atlasScreen.loader.add(atlas.key, atlas.url);
    }
    atlasScreen.loader.load(() => {
      console.log(atlasScreen.loader.resources);
      const frames = atlasScreen.loader.resources['loadingrun'].data.frames;
      let i = 0;
      let j = 0;
      for (const frameKey of Object.keys(frames)) {
        if (i >= 4) {
          i = 0;
          j++;
        }
        const temp = atlasScreen.add.image(frameKey, atlasScreen.stage);
        const size = frames[frameKey].sourceSize;

        temp.width = 200;
        temp.height = 200 / size.w * size.h;
        temp.x = i * temp.width;
        temp.y = j * temp.height;
        temp.tint = 0xffffff;
        console.log(temp);
        i++;
      }

    });
    console.log(atlasScreen);
  }, []);
  return (
    <>
      <Divider orientation="left">已加载的atlas</Divider>
      <div id="atlas"></div>
    </>
  );
};

export default ModalTexturePicker;
