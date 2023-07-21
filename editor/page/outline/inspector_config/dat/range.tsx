/*
 * @Author: kunnisser
 * @Date: 2023-07-20 15:08:18
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-21 16:17:20
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/range.tsx
 * @Description: ---- 范围数值选择 ----
 */
import React, { useEffect, useState } from "react";
import { DefaultProps } from "./interface";
import isString from "lodash.isstring";
import cx from "classnames";
import { Slider } from "antd";

const DatRange = (props: DefaultProps) => {
  const [value, setValue] = useState() as any;
  const defaultVal = props.defaultVal;
  const handleChange = (vals: Array<number>) => {
    const { liveUpdate, _onUpdateValue, onUpdate, path } = props;
    _onUpdateValue && _onUpdateValue(path, vals);
    if (liveUpdate) {
      onUpdate && onUpdate(vals);
    }
    setValue(vals);
  };
  const { path, label, className, min, max } = props;
  const labelText = isString(label) ? label : path;
  const labelWidth = "100%";

  useEffect(() => {
    setValue(defaultVal);
  }, [defaultVal]);

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
          value={value}
          min={min}
          max={max}
          onChange={handleChange}
        />
      </div>
    </li>
  );
};

export default DatRange;
