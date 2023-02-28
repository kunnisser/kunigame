/*
 * @Author: kunnisser
 * @Date: 2023-02-28 14:21:18
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-28 14:50:50
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/textarea.tsx
 * @Description: ---- 多行文本设置 ----
 */

import React, { ChangeEvent } from "react";
import { DefaultProps } from "./interface";
import isString from "lodash.isstring";
import cx from "classnames";

const DatTextAreaPicker = (props: DefaultProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { liveUpdate, _onUpdateValue, onUpdate, path } = props;
    _onUpdateValue && _onUpdateValue(path, e.target.value);
    if (liveUpdate) {
      onUpdate && onUpdate(e.target.value);
    }
  };

  const { path, label, className } = props;
  const labelText = isString(label) ? label : path;
  const labelWidth = "100%";
  const defaultVal = props.data ? props.data[path] : "";

  return (
    <li
      className={cx("cr", "string", className)}
      style={{
        width: labelWidth
      }}
    >
      <div className="cr-item">
        <label>{labelText}</label>
      </div>
      <div>
        <textarea value={defaultVal} onChange={handleChange}></textarea>
      </div>
    </li>
  );
};

export default DatTextAreaPicker;
