/*
 * @Author: kunnisser
 * @Date: 2023-03-19 17:33:34
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-26 22:26:52
 * @FilePath: \kunigame\editor\page\outline\inspector_config\dat\modal\pickerWrapper.tsx
 * @Description: ---- 选择内容外层 ----
 */
import React from "react";
import ModalTexturePicker from "./texturePicker";
import ModalImagePicker from "./imagePicker";
import { Badge } from "antd";

const ModalPickerWrapper = (props: any) => {
  const { defaultVal, imageList, currentScene, atlasList, changeTexture } =
    props;

  return (
    <>      <Badge.Ribbon placement={"start"} text="已加载的Images">
      <div style={{ height: "50px" }}></div>
    </Badge.Ribbon>
      <ModalImagePicker
        pickValue={defaultVal}
        changeTexture={changeTexture}
        images={imageList}
        game={currentScene.game}
      ></ModalImagePicker>
      <Badge.Ribbon placement={"start"} text="已加载的Atlas">
        <div style={{ height: "50px" }}></div>
      </Badge.Ribbon>
      <ModalTexturePicker
        pickValue={defaultVal}
        changeTexture={changeTexture}
        atlasList={atlasList}
      ></ModalTexturePicker>
    </>
  );
};

export default ModalPickerWrapper;
