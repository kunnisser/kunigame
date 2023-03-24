/*
 * @Author: kunnisser
 * @Date: 2023-03-19 17:33:34
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-24 16:40:37
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/modal/pickerWrapper.tsx
 * @Description: ---- 选择内容外层 ----
 */
import React, {
  createContext,
  forwardRef,
  useImperativeHandle,
  useState
} from "react";
import ModalTexturePicker from "./texturePicker";
import ModalImagePicker from "./imagePicker";
import { Badge } from "antd";
export const TextureContext = createContext({});

const ModalPickerWrapper = forwardRef((props: any, ref: any) => {
  const { defaultVal, imageList, currentScene, atlasList, changeTexture } =
    props;
  const [pickValue, setPickValue] = useState(defaultVal);

  useImperativeHandle(ref, () => {
    return { pickValue };
  });

  return (
    <TextureContext.Provider value={{ pickValue, setPickValue }}>
      <Badge.Ribbon placement={"start"} text="已加载的Images">
        <div style={{ height: "50px" }}></div>
      </Badge.Ribbon>
      <ModalImagePicker
        changeTexture={changeTexture}
        images={imageList}
        game={currentScene.game}
      ></ModalImagePicker>
      <Badge.Ribbon placement={"start"} text="已加载的Atlas">
        <div style={{ height: "50px" }}></div>
      </Badge.Ribbon>
      <ModalTexturePicker
        changeTexture={changeTexture}
        atlasList={atlasList}
      ></ModalTexturePicker>
    </TextureContext.Provider>
  );
});

export default ModalPickerWrapper;
