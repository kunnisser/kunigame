/*
 * @Author: kunnisser
 * @Date: 2023-02-27 16:55:00
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-02-27 16:55:50
 * @FilePath: /kunigame/editor/page/outline/inspector_config/dat/interface/index.ts
 * @Description: ----dat-gui 类型定义 ----
 */

export interface DefaultProps {
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
