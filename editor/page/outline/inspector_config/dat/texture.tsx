/*
 * @Author: kunnisser
 * @Date: 2023-03-15 09:58:26
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-20 15:26:06
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/texture.tsx
 * @Description: ---- 纹理选择 ----
 */

import React, { useContext, useEffect, useRef } from "react";
import { DefaultProps } from "./interface";
import isString from "lodash.isstring";
import cx from "classnames";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import { ModalOptions } from "editor@/feedback/modalcore";
import { WrapContext } from "editor@/page/wireboard";
import ModalPickerWrapper from "./modal/pickerWrapper";
import { utils } from "pixi.js";
import Game from "ts@/kuni/lib/core";
import KnSprite from "ts@/kuni/lib/gameobjects/kn_sprite";

let previewGame: any = null;

const DatTexture = (props: DefaultProps) => {
  DatTexture["staticProps"] = props;
  const { path, label, className } = props;
  const ref = useRef({
    sprite: null
  });
  const defaultVal =
    props.data && props.data[path] ? props.data[path] : "attack";
  const { openModal }: any = useContext(WrapContext);
  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  const labelText = isString(label) ? label : path;
  const labelWidth = "100%";
  const previewWidth = 270;
  const previewHeight = 270;

  const changeTextureKey = (key) => {
    const { liveUpdate, _onUpdateValue, onUpdate, onChange, path } =
      DatTexture["staticProps"];
    if (onChange) {
      onChange(key);
      _onUpdateValue && _onUpdateValue(path, key);
      if (liveUpdate) {
        onUpdate && onUpdate(key);
      }
    } else {
      _onUpdateValue && _onUpdateValue(path, key);
      if (liveUpdate) {
        onUpdate && onUpdate(key);
      }
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
          changeTextureKey={changeTextureKey}
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
    const texture = utils.TextureCache[defaultVal];
    const ratio = texture.width / texture.height;
    const sprite = previewGame.add.image(
      "previewThumbImage",
      defaultVal,
      previewGame.stage,
      [0.5, 0.5]
    );
    sprite.x = previewWidth * 0.5;
    sprite.y = previewHeight * 0.5;
    sprite.width = ratio > 1 ? previewWidth : previewHeight * ratio;
    sprite.height = ratio > 1 ? previewWidth / ratio : previewHeight;
    sprite.tint = 0xffffff;
    ref.current.sprite = sprite;
  }, []);

  useEffect(() => {
    if (ref.current.sprite) {
      const texture = utils.TextureCache[defaultVal];
      const sprite: KnSprite = ref.current.sprite;
      const ratio = texture.width / texture.height;
      sprite.texture = texture;
      sprite.width = ratio > 1 ? previewWidth : previewHeight * ratio;
      sprite.height = ratio > 1 ? previewWidth / ratio : previewHeight;
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
      <div className="kn-texture">{<div id="texturePreview"></div>}</div>
      <div className="kn-texture-bar">
        <Button type="primary" block onClick={pickTexture}>
          {defaultVal}
        </Button>
      </div>
    </li>
  );
};

export default DatTexture;
