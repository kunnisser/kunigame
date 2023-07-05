/*
 * @Author: kunnisser
 * @Date: 2023-02-27 00:17:14
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-07-05 17:38:24
 * @FilePath: /kunigame/editor/page/outline/inspector_config/config/index.ts
 * @Description: ---- 配置集合 ----
 */
import DatBitMapTextPropertyConfig from "./bitmapText";
import DatGroupPropertyConfig from "./group";
import DatSpritePropertyConfig from "./sprite";
import DatTextPropertyConfig from "./text";

export interface DatProperties {
  index?: number;
  label: string;
  component: any;
  children?: Array<DatProperties>;
  path?: Array<string>;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<string | number> | any;
  optionLabels?: Array<any>;
  onClick?: any;
}

const InspectorConfig = {
  KnText: DatTextPropertyConfig,
  KnGroup: DatGroupPropertyConfig,
  KnSprite: DatSpritePropertyConfig,
  KnBitMapText: DatBitMapTextPropertyConfig
};

export { InspectorConfig };
