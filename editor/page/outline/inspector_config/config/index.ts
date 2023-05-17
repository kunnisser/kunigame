/*
 * @Author: kunnisser
 * @Date: 2023-02-27 00:17:14
 * @LastEditors: kunnisser
 * @LastEditTime: 2023-05-17 16:15:34
 * @FilePath: /kunigame/editor/page/outline/inspector_config/config/index.ts
 * @Description: ---- 配置集合 ----
 */

import DatAdmixtureConfig from "./admixture";
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
  options?: Array<string | number>;
  optionLabels?: Array<any>;
}

const InspectorConfig = {
  KnText: DatTextPropertyConfig,
  KnGroup: DatGroupPropertyConfig,
  KnSprite: DatSpritePropertyConfig,
  KnBitMapText: DatBitMapTextPropertyConfig,
  Admixture: DatAdmixtureConfig
};

export { InspectorConfig };
