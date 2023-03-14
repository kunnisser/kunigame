/*
 * @Author: kunnisser
 * @Date: 2023-02-06 17:05:34
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-14 17:29:35
 * @FilePath: /kunigame/editor/page/outline/outline_tree/assets.tsx
 * @Description: ---- 素材列表 ----
 */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Collapse, Space } from "antd";
import { CombineReducer } from "editor@/common/store";
import { getProjectAssets } from "editor@/api/request/project";
import { EditGameName } from "editor@/page/workbench/canvas";
import "editor@/assets/index.styl";

const { Panel } = Collapse;
const AssetsList = () => {
  const [imagePath, setImagePath] = useState(null);
  const [imageList, setImageList] = useState([] as any);
  const [prefabList, setPrefabList] = useState([] as any);

  const forceToImage = (url: string) => {
    const [prefixUrl, suffix] = url.split(".");
    const isNotImage = ["xml", "fnt"].indexOf(suffix) >= 0;
    return isNotImage ? prefixUrl + ".png" : url;
  };

  const currentScene = useSelector(
    (store: CombineReducer) => store.sceneReducer.currentScene
  );
  useEffect(() => {
    if (currentScene) {
      console.log(currentScene.resouces);
      const resourceKeys = Object.keys(currentScene.resouces);
      const resources = resourceKeys.map((key) => {
        return {
          key,
          value: forceToImage(currentScene.resouces[key])
        };
      });
      setPrefabList(resources);
      getProjectAssets(void 0, {
        projectName: EditGameName,
        assetsType: "images"
      }).then((ret) => {
        if (ret.data) {
          const { path, assets } = ret.data.data;
          setImagePath(path);
          setImageList(assets);
        }
      });
    }
  }, [currentScene]);

  const dragHandle = (ret) => {
    console.log(ret);
  };
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      style={{ paddingBottom: "30px" }}
    >
      <Panel header="当前场景资源" key="1">
        <Space align="center" wrap>
          {prefabList.map((prefab: any) => {
            return (
              <div key={prefab.key} draggable={false}>
                <div className="kn-image-thumb">
                  <img draggable={false} src={`${prefab.value}`}></img>
                </div>
                <p style={{ textAlign: "center" }}>{prefab.key}</p>
              </div>
            );
          })}
        </Space>
      </Panel>
      <Panel header="Images" key="2">
        <Space align="center" wrap>
          {imageList.map((image: string) => {
            return (
              <div key={image} draggable={true} onDragStart={dragHandle}>
                <div className="kn-image-thumb">
                  <img draggable={false} src={`${imagePath}/${image}`}></img>
                </div>
                <p style={{ textAlign: "center" }}>{image}</p>
              </div>
            );
          })}
        </Space>
      </Panel>
      <Panel header="Atlas" key="3">
        456{" "}
      </Panel>
    </Collapse>
  );
};

export default AssetsList;
