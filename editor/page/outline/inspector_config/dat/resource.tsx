/*
 * @Author: kunnisser
 * @Date: 2023-02-27 16:51:41
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-27 17:31:03
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/resource.tsx
 * @Description: ---- inspector - Resource - checkbox ----
 */
import React from "react";
import { DefaultProps } from "./interface";
import isString from "lodash.isstring";
import cx from "classnames";
import { Button, Space } from "antd";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";

const FONT_TYPE = 6;

const DatResourcePicker = (props: DefaultProps) => {
  const handleChange = (val) => {
    const { liveUpdate, _onUpdateValue, onUpdate, path } = props;
    _onUpdateValue && _onUpdateValue(path, val);
    if (liveUpdate) {
      onUpdate && onUpdate(val);
    }
  };
  const game = useSelector((store: CombineReducer) => store.sceneReducer.game);
  const resources: Array<any> = Object.values(game.loader.resources);
  const fontResources: Array<string> = resources
    .filter((res) => {
      return res.type === FONT_TYPE;
    })
    .map((item) => item.name);
  const { path, label, className } = props;
  const labelText = isString(label) ? label : path;
  const labelWidth = "100%";
  const defaultVal = props.data ? props.data[path] : "";

  return (
    <li
      className={cx("cr", "select", className)}
      style={{
        width: labelWidth
      }}
    >
      <div>
        <label>{labelText}</label>
      </div>
      <Space
        size={[50, 20]}
        wrap
        align="center"
        style={{ padding: "10px 0 10px 46px" }}
      >
        {fontResources.map((name) => {
          return (
            <Button
              key={name}
              type={defaultVal === name ? "primary" : "default"}
              onClick={() => handleChange(name)}
            >
              {name}
            </Button>
          );
        })}
      </Space>
    </li>
  );
};

export default DatResourcePicker;
