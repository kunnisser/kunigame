/*
 * @Author: kunnisser
 * @Date: 2023-07-20 15:08:18
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-20 17:22:37
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/range.tsx
 * @Description: ---- 范围数值选择 ----
 */
import React from "react";
import { DefaultProps } from "./interface";
import isString from "lodash.isstring";
import cx from "classnames";
import { Slider } from "antd";

const DatRange = (props: DefaultProps) => {
  const handleChange = (vals: Array<number>) => {
    const { liveUpdate, _onUpdateValue, onUpdate, path } = props;
    _onUpdateValue && _onUpdateValue(path, vals);
    if (liveUpdate) {
      onUpdate && onUpdate(vals);
    }
  };

  const { path, label, className, min, max } = props;
  const labelText = isString(label) ? label : path;
  const labelWidth = "100%";
  console.log(min, max);
  const defaultVal = props.defaultVal;

  return (
    <li
      className={cx("cr", "string", className)}
      style={{
        width: labelWidth
      }}
    >
      <div>
        <label>{labelText}</label>
      </div>
      <div className="cr-item">
        <Slider
          range
          defaultValue={defaultVal}
          min={min}
          max={max}
          onChange={handleChange}
        />
      </div>
    </li>
  );
};

export default DatRange;
