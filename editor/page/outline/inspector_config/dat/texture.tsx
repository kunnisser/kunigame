/*
 * @Author: kunnisser
 * @Date: 2023-03-15 09:58:26
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-17 17:41:16
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/texture.tsx
 * @Description: ---- 纹理选择 ----
 */

import React, { useContext, useRef } from "react";
import { DefaultProps } from "./interface";
import isString from "lodash.isstring";
import cx from "classnames";
import { Button, Divider, Image, Space } from "antd";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import { WrapContext } from "editor@/page/wireboard";
import { ModalOptions } from "editor@/feedback/modalcore";
import ModalTexturePicker from "./modal/texturePicker";
import ModalImagePicker from "./modal/imagePicker";
const DatTexture = (props: DefaultProps) => {
  const { openModal, closeModal }: any = useContext(WrapContext);
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const { path, label, className } = props;
  const labelText = isString(label) ? label : path;
  const labelWidth = "100%";
  const defaultVal = props.data ? props.data[path] : "";
  const ref: any = useRef({
    update: 0
  });

  const changeTexture = () => {
    const { liveUpdate, _onUpdateValue, onUpdate, path } = props;
    const texture = ref.current.pickValue;
    _onUpdateValue && _onUpdateValue(path, texture);
    if (liveUpdate) {
      onUpdate && onUpdate(texture);
    }
    closeModal();
  };

  const generateTextureAbleList = () => {
    const gameResources = currentScene.game.loader.resources;
    const resourceKeys = Object.keys(currentScene.resources);
    const imageList: Array<any> = [];
    const atlasList: Array<any> = [];
    resourceKeys
      .filter((key: string) => {
        return (
          ["png", "jpg", "json"].indexOf(gameResources[key].extension) > -1
        );
      })
      .map((resourceKey) => {
        if (gameResources[resourceKey].extension === "json") {
          return atlasList.push({
            type: "atlas",
            key: resourceKey,
            url: gameResources[resourceKey].url,
            frames: gameResources[resourceKey].data.frames
          });
        } else {
          return imageList.push({
            type: "images",
            key: resourceKey,
            url: gameResources[resourceKey].url
          });
        }
      });
    return [imageList, atlasList];
  };

  const pickTexture = () => {
    const [imageList, atlasList] = generateTextureAbleList();
    openModal({
      width: 840,
      name: "选择纹理",
      content: (
        <React.Fragment>
          <Divider orientation="left">已加载的Images</Divider>
          <ModalImagePicker
            ref={ref}
            images={imageList}
            defaultVal={defaultVal}
            game={currentScene.game}
          ></ModalImagePicker>
          <Divider orientation="left">已加载的Atlas</Divider>
          <Space key={"modal-atlas-picker"} direction="vertical">
            {atlasList.map((atlas) => {
              return (
                <ModalTexturePicker
                  key={atlas.key}
                  atlas={atlas}
                ></ModalTexturePicker>
              );
            })}
          </Space>
        </React.Fragment>
      ),
      footer: [
        <Button
          key="back"
          onClick={() => {
            closeModal();
          }}
        >
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={changeTexture}>
          选择
        </Button>
      ]
    } as ModalOptions);
    console.log(ref);
    ref.current.update += 1;
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
