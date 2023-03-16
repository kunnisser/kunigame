/*
 * @Author: kunnisser
 * @Date: 2023-03-15 09:58:26
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-16 17:00:23
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/texture.tsx
 * @Description: ---- 纹理选择 ----
 */

import React, { useContext } from "react";
import { DefaultProps } from "./interface";
import isString from "lodash.isstring";
import cx from "classnames";
import { Button, Image } from "antd";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import { RadioChangeEvent } from "antd/lib/radio";
import { WrapContext } from "editor@/page/wireboard";
import { ModalOptions } from "editor@/feedback/modalcore";
import ModalTexturePicker from "./modal/texturePicker";
const DatTexture = (props: DefaultProps) => {
  const { openModal }: any = useContext(WrapContext);
  const handleChange = (e: RadioChangeEvent) => {
    const { liveUpdate, _onUpdateValue, onUpdate, path } = props;
    _onUpdateValue && _onUpdateValue(path, e.target.value);
    if (liveUpdate) {
      onUpdate && onUpdate(e.target.value);
    }
  };
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const { path, label, className } = props;
  const labelText = isString(label) ? label : path;
  const labelWidth = "100%";
  const defaultVal = props.data ? props.data[path] : "";
  console.log(defaultVal);

  const generateTextureAbleList = () => {
    const gameResources = currentScene.game.loader.resources;
    const resourceKeys = Object.keys(currentScene.resources);
    const textureResources = resourceKeys
      .filter((key: string) => {
        return (
          ["png", "jpg", "json"].indexOf(gameResources[key].extension) > -1
        );
      })
      .map((resourceKey) => {
        if (gameResources[resourceKey].extension === "json") {
          return {
            type: "atlas",
            key: resourceKey,
            url: gameResources[resourceKey].url
          };
        } else {
          return {
            type: "images",
            key: resourceKey,
            url: gameResources[resourceKey].url
          };
        }
      });
    console.log(textureResources);
    return textureResources;
  };

  const pickTexture = () => {
    const textureAbleList = generateTextureAbleList();
    console.log(textureAbleList);

    openModal({
      width: 800,
      name: "选择纹理",
      content: (
        <React.Fragment>
          <ModalTexturePicker
            textureAbleList={textureAbleList}
          ></ModalTexturePicker>
        </React.Fragment>
      ),
      footer: [
        <Button key="back">取消</Button>,
        <Button key="submit" type="primary">
          选择
        </Button>
      ]
    } as ModalOptions);
  };

  return (
    <li
      className={cx("cr", "radio", className)}
      style={{
        width: labelWidth
      }}
    >
      <div style={{ paddingTop: "10px" }}>
        <label>{labelText}</label>
      </div>
      <div className="kn-texture">
        <Image src={defaultVal.baseTexture.resource.url} />
      </div>
      <div className="kn-texture-bar">
        <Button type="primary" block onClick={pickTexture}>
          {defaultVal.textureCacheIds[0]}
        </Button>
      </div>
    </li>
  );
};

export default DatTexture;
