/*
 * @Author: kunnisser
 * @Date: 2023-03-15 09:58:26
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-23 17:20:17
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/texture.tsx
 * @Description: ---- 纹理选择 ----
 */

import React, { useContext, useEffect, useState } from "react";
import { DefaultProps } from "./interface";
import isString from "lodash.isstring";
import cx from "classnames";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import { ModalOptions } from "editor@/feedback/modalcore";
import { WrapContext } from "editor@/page/wireboard";
import ModalPickerWrapper from "./modal/pickerWrapper";
import Game from "ts@/kuni/lib/core";

let previewGame: any = null;
const DatTexture = (props: DefaultProps) => {
  const { path, label, className } = props;
  const [previewSprite, setPreviewSprite] = useState(null as any);
  const defaultVal = props.data ? props.data[path] : "";
  const { openModal }: any = useContext(WrapContext);
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const labelText = isString(label) ? label : path;
  const labelWidth = "100%";
  const previewWidth = 270;
  const previewHeight = 270;

  const changeTexture = (texture) => {
    const { liveUpdate, _onUpdateValue, onUpdate, path } = props;
    _onUpdateValue && _onUpdateValue(path, texture);
    if (liveUpdate) {
      onUpdate && onUpdate(texture);
    }
  };

  const generateTextureAbleList = () => {
    const gameResources = currentScene.game.loader.preloader.resources;
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
        <ModalPickerWrapper
          currentScene={currentScene}
          imageList={imageList}
          atlasList={atlasList}
          defaultVal={defaultVal}
          changeTexture={changeTexture}
        ></ModalPickerWrapper>
      ),
      footer: []
    } as ModalOptions);
  };

  useEffect(() => {
    const textureDom: any = document.getElementById("texturePreview");
    if (!previewGame) {
      const dpr = window.devicePixelRatio;
      previewGame = new Game({
        width: previewWidth / dpr,
        height: previewHeight / dpr,
        dpr,
        transparent: true,
        view: textureDom,
        isPureCanvas: true
      });
    } else {
      textureDom.appendChild(previewGame.app.view);
      previewGame.stage.removeChildren();
    }

    const ratio = defaultVal.width / defaultVal.height;
    const sprite = previewGame.add.image(
      "",
      defaultVal,
      previewGame.stage,
      [0.5, 0.5]
    );
    sprite.x = previewWidth * 0.5;
    sprite.y = previewHeight * 0.5;
    sprite.width = ratio > 1 ? previewWidth : previewHeight * ratio;
    sprite.height = ratio > 1 ? previewWidth / ratio : previewHeight;
    sprite.tint = 0xffffff;
    console.log(sprite);
    setPreviewSprite(sprite);
  }, []);

  useEffect(() => {
    if (previewSprite) {
      const ratio = defaultVal.width / defaultVal.height;
      previewSprite.width = ratio > 1 ? previewWidth : previewHeight * ratio;
      previewSprite.height = ratio > 1 ? previewWidth / ratio : previewHeight;
      previewSprite.texture = defaultVal;
      setPreviewSprite(previewSprite);
    }
  }, [defaultVal]);

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
        <div id="texturePreview"></div>
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
