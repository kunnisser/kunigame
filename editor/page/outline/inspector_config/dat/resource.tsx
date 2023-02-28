/*
 * @Author: kunnisser
 * @Date: 2023-02-27 16:51:41
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-28 16:18:00
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/resource.tsx
 * @Description: ---- inspector - Resource - checkbox ----
 */
import React from "react";
import { DefaultProps } from "./interface";
import isString from "lodash.isstring";
import cx from "classnames";
import { Radio } from "antd";
import { useSelector } from "react-redux";
import { CombineReducer } from "editor@/common/store";
import { RadioChangeEvent } from "antd/lib/radio";

const DatResourcePicker = (props: DefaultProps) => {
  const handleChange = (e: RadioChangeEvent) => {
    const { liveUpdate, _onUpdateValue, onUpdate, path } = props;
    _onUpdateValue && _onUpdateValue(path, e.target.value);
    if (liveUpdate) {
      onUpdate && onUpdate(e.target.value);
    }
  };
  const game = useSelector((store: CombineReducer) => store.sceneReducer.game);
  const resources: Array<any> = Object.values(game.loader.resources);
  const fontResources: Array<string> = resources
    .filter((res) => {
      return res.bitmapFont;
    })
    .map((item) => item.name);
  const { path, label, className } = props;
  const labelText = isString(label) ? label : path;
  const labelWidth = "100%";
  const defaultVal = props.data ? props.data[path] : "";

  return (
    <li
      className={cx("cr", "radio", className)}
      style={{
        width: labelWidth
      }}
    >
      <div>
        <label>{labelText}</label>
      </div>
      <Radio.Group onChange={handleChange} value={defaultVal}>
        {fontResources.map((name) => {
          return (
            <Radio key={name} value={name}>
              {name}
            </Radio>
          );
        })}
      </Radio.Group>
    </li>
  );
};

export default DatResourcePicker;
