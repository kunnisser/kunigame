/*
 * @Author: kunnisser
 * @Date: 2021-01-29 23:24:27
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-02-18 15:01:19
 * @FilePath: /kunigame/editor/feedback/validate/rules.ts
 * @Description: ---- 表单验证规则 ----
 */

/*
*  -- form表单输入验证 --
*  @param {function} checkLength - 验证字符串长度
*  @param {function} checkNumVal - 验证数字大小
*  @param {function} checkPhone - 验证手机号码格式
*  @param {function} checkSwitch - 验证开关是否打开
* */

const checkLength = (rule, value = '', item) => {
  if (value.length > item.max_val || value.length < item.min_val) {
    throw new Error(`输入内容长度应在${item.min_val} - ${item.max_val}之间`);
  }
}

const checkNumVal = (rule, value = 0, item) => {
  if (+value > +item.max_val || (+value < +item.min_val)) {
    throw new Error(`数值需≥${item.min_val}${item.max_val ? '或≤' + item.max_val : ''}`);
  }
}

const checkPhone = (rule, value = '', item) => {
  const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!phoneReg.test(value)) {
    throw new Error(`手机号码不正确`);
  }
}

const checkSwitch = (rule, value) => {
  if (!value) {
    throw new Error(`请勾选`);
  }
}

const allowEnInput = (rule, value) => {
  const pattern: RegExp = new RegExp("[A-Za-z]+$");

  if (!pattern.test(value)) {
    throw new Error(`请输入英文`);
  }
}

const ruleMap = new Map<string, Function>([
  ['phone', checkPhone],
  ['len', checkLength],
  ['check', checkSwitch],
  ['num', checkNumVal],
  ['en', allowEnInput],
]);

export default ruleMap;