/*
 * @Author: kunnisser
 * @Date: 2023-02-24 14:14:57
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-25 20:05:50
 * @FilePath: \kunigame\editor\page\outline\inspector_config\dat\anchor.tsx
 * @Description: ----  ----
 */
import React from "react";
import isString from "lodash.isstring";
import cx from "classnames";
import { Button, Space } from "antd";
import Icon from "@ant-design/icons";
import {
  BorderOuterOutlined
} from "@ant-design/icons";
import { LeftArrow, LeftTopArrow, LeftBottomArrow, TopArrow, BottomArrow, RightArrow, RightBottomArrow, RightTopArrow } from 'editor@/assets/icon';

interface DefaultProps {
  className?: String;
  style?: "any";
  data?: any;
  path: string;
  label: String;
  labelWidth?: String;
  liveUpdate?: Boolean;
  onUpdate?: Function;
  _onUpdateValue?: Function;
}

const DatAnchor = (props: DefaultProps) => {
  const handleChange = (val) => {
    const { liveUpdate, _onUpdateValue, onUpdate, path } = props;
    _onUpdateValue && _onUpdateValue(path, val);
    if (liveUpdate) {
      onUpdate && onUpdate(val);
    }
  };

  const { path, label, className } = props;
  const labelText = isString(label) ? label : path;
  const labelWidth = "100%";
  const defaultVal = props.data ? props.data[path] : [];

  const anchorOptions = [
    {
      icon: <Icon component={LeftTopArrow as any} />,
      val: defaultVal.clone().set(0, 0)
    },
    {
      icon: <Icon component={TopArrow as any} />,
      val: defaultVal.clone().set(0.5, 0)
    },
    {
      icon: <Icon component={RightTopArrow as any} />,
      val: defaultVal.clone().set(1, 0)
    },
    {
      icon: <Icon component={LeftArrow as any} />,
      val: defaultVal.clone().set(0, 0.5)
    },
    {
      icon: <BorderOuterOutlined />,
      val: defaultVal.clone().set(0.5, 0.5)
    },
    {
      icon: <Icon component={RightArrow as any} />,
      val: defaultVal.clone().set(1, 0.5)
    },
    {
      icon: <Icon component={LeftBottomArrow as any} />,
      val: defaultVal.clone().set(0, 1)
    },
    {
      icon: <Icon component={BottomArrow as any} />,
      val: defaultVal.clone().set(0.5, 1)
    },
    {
      icon: <Icon component={RightBottomArrow as any} />,
      val: defaultVal.clone().set(1, 1)
    }
  ];
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
        style={{ padding: "10px 0 10px 50px" }}
      >
        {anchorOptions.map((option) => {
          return (
            <Button
              key={option.val + ""}
              type={
                defaultVal.x === option.val.x && defaultVal.y === option.val.y
                  ? "primary"
                  : "default"
              }
              size="small"
              icon={option.icon}
              onClick={() => handleChange(option.val)}
            >
              {/* {option.label} */}
            </Button>
          );
        })}
      </Space>
    </li>
  );
};

export default DatAnchor;
