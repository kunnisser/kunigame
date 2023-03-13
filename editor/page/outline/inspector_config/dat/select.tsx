/*
 * @Author: kunnisser
 * @Date: 2023-03-13 16:15:14
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-03-13 17:01:54
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/select.tsx
 * @Description: ---- 兼容性更好的select ----
 */

import React from "react";
import isString from "lodash.isstring";
import cx from "classnames";
import { DefaultProps } from "./interface";

const FixedNumberDatSelect = (props: DefaultProps) => {
  const { path, label, labelWidth, optionLabels, options, className } = props;
  const labelText = isString(label) ? label : path;
  const defaultData = props.data ? props.data[path] : "";
  const defaultValue = options?.indexOf(defaultData);
  const handleChange = (event) => {
    const val = options ? options[+event.target.value] : "";
    const { liveUpdate, _onUpdateValue, onUpdate, path } = props;
    _onUpdateValue && _onUpdateValue(path, val);
    if (liveUpdate) {
      onUpdate && onUpdate(val);
    }
  };

  return (
    <li className={cx("cr", "select", className)}>
      <label>
        <span className="label-text">{labelText}</span>
        <select
          value={defaultValue}
          onChange={handleChange}
          style={{ width: `calc(100% - ${labelWidth})` }}
        >
          {options?.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <option key={index} value={index}>
              {optionLabels ? optionLabels[index] : item}
            </option>
          ))}
        </select>
      </label>
    </li>
  );
};

export default FixedNumberDatSelect;
