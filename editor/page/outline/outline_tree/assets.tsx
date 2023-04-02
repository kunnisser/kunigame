/*
 * @Author: kunnisser
 * @Date: 2023-02-06 17:05:34
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-04-02 00:52:59
 * @FilePath: \kunigame\editor\page\outline\outline_tree\assets.tsx
 * @Description: ---- 素材列表 ----
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { Collapse, Empty, Space, Tag } from "antd";
import { getProjectAssets } from "editor@/api/request/project";
import { EditGameName } from "editor@/page/workbench/canvas";
import { setDragTarget } from "editor@/common/gameStore/scene/action";
import "editor@/assets/index.styl";

const { Panel } = Collapse;
const AssetsList = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const [assetsPath, imageDir, atlasDir, fontDir] = [
    "/projects/hive",
    "/assets/images/",
    "/assets/atlas/",
    "/assets/fonts/"
  ];
  const [imageList, setImageList] = useState([] as any);
  const [atlasList, setAtlasList] = useState([] as any);
  const [fontList, setFontList] = useState([] as any);
  const [prefabList, setPrefabList] = useState([] as any);

  const forceToImage = (url: string) => {
    const [prefixUrl, suffix] = url.split(".");
    const isNotImage = ["xml", "fnt", "json"].indexOf(suffix) >= 0;
    return isNotImage ? prefixUrl + ".png" : url;
  };

  /**
   * @description: 判断资源类型
   * @param {string} origin
   * @param {string} value
   * @return {*}
   */
  const generatePrefabTag = (origin: string, value: string) => {
    const [prefixOrigin, suffix] = origin.split(".");
    const prefixValue = value.split(".")[0];
    const tagType = [
      {
        color: "red",
        name: "Font"
      },
      {
        color: "green",
        name: "Image"
      },
      {
        color: "blue",
        name: "Atlas"
      }
    ];
    let typeIndex = 0;
    ["xml", "fnt"].indexOf(suffix) >= 0 && (typeIndex = 0);
    ["png", "jpg"].indexOf(suffix) >= 0 && (typeIndex = 1);
    ["json"].indexOf(suffix) >= 0 &&
      prefixOrigin === prefixValue &&
      (typeIndex = 2);
    return tagType[typeIndex];
  };

  useEffect(() => {
    store.subscribe(() => {
      const currentScene = store.getState().sceneReducer.currentScene;
      if (currentScene) {
        const resourceKeys = Object.keys(currentScene.resources);
        const resources = resourceKeys.map((key) => {
          return {
            key,
            origin: currentScene.resources[key],
            value: forceToImage(currentScene.resources[key])
          };
        });
        setPrefabList(resources);
      }
    });

    getProjectAssets(void 0, {
      projectName: EditGameName
    }).then((ret) => {
      if (ret.data) {
        const { assets } = ret.data.data;
        setImageList(assets.images);
        setAtlasList(assets.atlas);
        setFontList(assets.font);
      }
    });
  }, []);

  const dragHandle = (path) => {
    dispatch(setDragTarget(path));
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["2", "3", "4"]}
      style={{ paddingBottom: "30px" }}
    >
      <Panel header="当前场景资源" key="1">
        {prefabList.length > 0 ? (
          <Space align="center" wrap>
            {prefabList.map((prefab: any) => {
              const tagType = generatePrefabTag(prefab.origin, prefab.value);
              return (
                <div key={prefab.key} draggable={false}>
                  <div className="kn-image-thumb">
                    <img draggable={false} src={`${prefab.value}`}></img>
                  </div>
                  <p style={{ textAlign: "center", padding: "4px" }}>
                    <Tag color={tagType.color}>{tagType.name}</Tag>
                    {prefab.key}
                  </p>
                </div>
              );
            })}
          </Space>
        ) : (
          <Empty></Empty>
        )}
      </Panel>
      <Panel header="Images" key="2">
        {imageList.length > 0 ? (
          <Space align="center" wrap>
            {imageList.map((image: string) => {
              const imageName = image.split(".")[0];
              return (
                <div
                  key={image}
                  draggable={true}
                  onDragStart={() =>
                    dragHandle({
                      key: imageName,
                      url: `${assetsPath}/${EditGameName}${imageDir}${image}`
                    })
                  }
                >
                  <div className="kn-image-thumb">
                    <img
                      draggable={false}
                      src={`${assetsPath}/${EditGameName}${imageDir}${image}`}
                    ></img>
                  </div>
                  <p style={{ textAlign: "center" }}>{image}</p>
                </div>
              );
            })}
          </Space>
        ) : (
          <Empty></Empty>
        )}
      </Panel>
      <Panel header="Atlas" key="3">
        {atlasList.length > 0 ? (
          <Space align="center" wrap>
            {atlasList.map((atlas: string) => {
              const [atlasName, fileType] = atlas.split(".");
              const isShow = ["png", "jpg"].indexOf(fileType) === -1;
              return (
                isShow && (
                  <div
                    key={atlas}
                    draggable={true}
                    onDragStart={() =>
                      dragHandle({
                        key: atlasName,
                        url: `${assetsPath}/${EditGameName}${atlasDir}${atlas}`
                      })
                    }
                  >
                    <div className="kn-image-thumb">
                      <img
                        draggable={false}
                        src={`${assetsPath}/${EditGameName}${atlasDir}${atlasName}.png`}
                      ></img>
                    </div>
                    <p style={{ textAlign: "center" }}>{atlas}</p>
                  </div>
                )
              );
            })}
          </Space>
        ) : (
          <Empty></Empty>
        )}
      </Panel>
      <Panel header="Font" key="4">
        {fontList.length > 0 ? (
          <Space align="center" wrap>
            {fontList.map((font: string) => {
              const [fontName, fileType] = font.split(".");
              const isShow = ["png", "jpg"].indexOf(fileType) === -1;
              return (
                isShow && (
                  <div
                    key={font}
                    draggable={true}
                    onDragStart={() =>
                      dragHandle({
                        key: fontName,
                        url: `${assetsPath}/${EditGameName}${fontDir}${font}`
                      })
                    }
                  >
                    <div className="kn-image-thumb">
                      <img
                        draggable={false}
                        src={`${assetsPath}/${EditGameName}${fontDir}${fontName}.png`}
                      ></img>
                    </div>
                    <p style={{ textAlign: "center" }}>{font}</p>
                  </div>
                )
              );
            })}
          </Space>
        ) : (
          <Empty></Empty>
        )}
      </Panel>
    </Collapse>
  );
};

export default AssetsList;
