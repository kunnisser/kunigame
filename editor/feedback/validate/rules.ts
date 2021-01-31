/*
 * @Author: kunnisser
 * @Date: 2021-01-29 23:24:27
 * @LastEditors: kunnisser
 * @LastEditTime: 2021-01-29 23:24:59
 * @FilePath: \kunigame\editor\feedback\validate\rules.ts
 * @Description: ---- 表单验证规则 ----
 */

/*
*  -- form表单输入验证 --
*  @param {function} checkLength - 验证字符串长度
*  @param {function} checkNumVal - 验证数字大小
*  @param {function} checkPhone - 验证手机号码格式
*  @param {function} checkSwitch - 验证开关是否打开
* */

const checkLength = (rule, value = '', cb: Function, item) => {
  if (value.length > item.max_val || value.length < item.min_val) {
    cb(`输入内容长度应在${item.min_val} - ${item.max_val}之间`);
  }
  cb();
}

const checkNumVal = (rule, value = 0, cb, item) => {
  if (+value > +item.max_val || (+value < +item.min_val)) {
    cb(`数值需≥${item.min_val}${item.max_val ? '或≤' + item.max_val : ''}`);
  }
  cb();
}

const checkPhone = (rule, value = '', cb, item) => {
  const phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!phoneReg.test(value)) {
    console.log(item);
    cb('手机号码不正确');
  }
  cb();
}

const checkSwitch = (rule, value, cb) => {
  if (!value) {
    cb('请勾选');
  }
  cb();
}

const ruleMap = new Map<string, Function>([
  ['phone', checkPhone],
  ['len', checkLength],
  ['check', checkSwitch],
  ['num', checkNumVal]
]);

export default ruleMap;