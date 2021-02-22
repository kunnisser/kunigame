// /*
//  * @Author: kunnisser
//  * @Date: 2021-01-29 23:20:11
//  * @LastEditors: kunnisser
//  * @LastEditTime: 2021-01-30 21:54:54
//  * @FilePath: \kunigame\editor\feedback\formcore.tsx
//  * @Description: ---- REACT16 ----
//  * +++++ <ANTD-V4 className="0"></ANTD-V4>表单封装  +++++
//  */


// /**
//  *  ------ form封装组件 ------
//  * @param {function} initialLayout 【初始化布局类型】
//  * @param {function} generateProps 【生成formitem的props】
//  * @param {object} formMap 【form组件集】
//  * @param {object} ruleMap 【form 输入规则集合】
// **/

// /**
//  * form配置信息
//  * @param items - form元素信息数组
//  * @param layout - form布局类型
//  * @param formTarget - form提交模式 - 自动提交 - 提交更新grid
//  */

// interface IFormConfig {
//   items: Array<Object>,
//   layout?: string, // 表单布局
//   defaultParams: object, // 默认参数
//   autoLoad: boolean, // 是否自动加载表格数据
//   tablekey?: string, // 刷新table的状态key
// }

// import * as React from 'react';
// import { Form, Input, Radio, Button, Checkbox, Select, DatePicker, Switch, Cascader, Slider } from 'antd';
// import ruleMap from './validate/rules';
// import { getFetch } from 'editor@/api';
// import moment from 'moment';
// import 'moment/locale/zh-cn';
// import 'Exam/assets/stylus/admin/form.styl';
// import TextArea from 'antd/lib/input/TextArea';

// const FormItem = Form.Item;
// const Option = Select.Option;
// const RangePicker = DatePicker.RangePicker;
// const MonthPicker = DatePicker.MonthPicker;
// const RadioGroup = Radio.Group;
// const CheckboxGroup = Checkbox.Group;
// moment.locale('zh-cn');
// interface IProps {
//   config: IFormConfig;
//   form: any;
//   [propName: string]: any;
// }

// interface Istate {
//   subloading: boolean; // 按钮加载状态
//   visible: { // 可见form元素状态
//     [propName: string]: any
//   },
//   asyncOptions: {} // 存放form元素异步选项状态
// }

// class Core extends React.PureComponent<IProps, any> {
//   public form: any;
//   public props: IProps;
//   public ruleMap: Map<string, any>;
//   public layout: object;
//   public getSelectOptions: Function;
//   public dateTypeMap: Map<string, Function>;
//   public formMap: Map<string, Function>;
//   public state: Istate;
//   constructor(props: IProps) {
//     super(props);
//     this.props = props;
//     this.form = this.props['form'];
//     this.ruleMap = ruleMap;
//     this.layout = this.initialLayout(props.config.layout);
//     this.state = {
//       subloading: !1,
//       visible: {},
//       asyncOptions: {}
//     };
//     this.initialForm();
//   }

//   initialLayout = (type?: any) => {
//     return { layout: type || 'inline' };
//   }

//   generateProps = (item = {}) => {
//     if (!item['param'] && item['type'] !== 'plugin') {
//       throw new Error('form配置项缺少param参数对象！');
//     }

//     // 合并构造验证条件
//     let rules: Array<any> = [
//       {
//         required: item['required'] || false,
//         message: item['requiredMes'] || '必填',
//         type: item['param'].type
//       },
//     ];
//     item['validator'] && item['validator'].forEach((valid) => {
//       rules.push({
//         type: item['param'].type,
//         validator: valid.type &&
//           ((rule, value, cb) => this.ruleMap.get(valid.type)(rule, value, cb, valid))
//       });
//     });
//     const rest = this.props.form.getFieldDecorator(item['param'].name, {
//       rules,
//       initialValue: item['defaultValue'],
//       valuePropName: item['propName'] || 'value'
//     });
//     return rest;
//   };

//   /*
//   *  -- Input 组件 --
//   *  @param {function} formInputHive - 基础Input组件
//   * */
//   public formInputHive: Function = (item?: any) => {
//     return this.generateProps(item)(
//       item['childType'] === 'textarea' ?
//         <TextArea autoSize={{ minRows: 3, maxRows: 5 }} className={item['inputClass'] || ''} placeholder={item['placeholder']} />
//         :
//         <Input type={item['childType']} disabled={item.disabled} className={item['inputClass'] || ''} placeholder={item['placeholder']} />
//     );
//   };

//   /*
//   *  -- select 组件 --
//   *  @param {function} formSelectHive - 基础select组件
//   * */

//   public formSelectHive = (item?: any) => {
//     let selectOptions = item['options'] || [];
//     const paramName = item['param'].name;
//     if (item['dataApi']) {
//       !item['dataApi'].loaded && this.getSelectOptions(item);
//       selectOptions = this.state[paramName] || [];
//     }

//     // 支持异步设置选项
//     return this.generateProps(item)(
//       <Select
//         mode={item.mode}
//         placeholder={item.placeholder}
//         onChange={(e: any) => this.visibleChange(e, item)}
//         getPopupContainer={trigger => trigger.parentNode as HTMLElement}
//         disabled={item.disabled}
//         style={{ width: item.width || 160 }}>
//         {
//           selectOptions.map((op: any) => (
//             (this.state[paramName] && item['dataApi']) ?
//               <Option key={op[item['mapKey'].text]} value={op[item['mapKey'].value]}>{op[item['mapKey'].text]}</Option> :
//               <Option key={op.label} value={op.value}>{op.label}</Option>
//           ))
//         }
//       </Select>
//     )
//   };

//   /*
// *  -- Cascader 组件 --
// *  @param {function} formCascaderHive - 基础Cascader组件
// * */
//   formCascaderHive = (item?: any) => {

//     // 独立特性 作为HOC组件
//     // const loadData = async (selectedOptions) => {
//     //   const targetOption = selectedOptions[selectedOptions.length - 1];
//     //   targetOption.loading = true;
//     //   let api = getFetch('axe/cascader');
//     //   let ret = await api(void 0, {});
//     //   targetOption.loading = false;
//     //   targetOption[item.fieldNames.children] = ret.data.data;
//     //   this.setState({
//     //     asyncOptions: {...this.state.asyncOptions}
//     //   })
//     // }

//     // 全量数据异步请求
//     const fetchOptions = async (isCompose, isAsync, item) => {
//       if (isCompose && isAsync) {
//         let api = getFetch(item.api);
//         let ret = await api(void 0, item.apiParams);
//         this.state.asyncOptions[item.param.name] = ret.data.data;
//         this.setState({
//           asyncOptions: { ...this.state.asyncOptions }
//         })
//       }
//     }

//     let options = void 0;
//     const isAsync = item.optType === 'async';
//     if (isAsync) {
//       options = this.state.asyncOptions[item.param.name];
//     }

//     const isStatic = item.optType === 'static';
//     if (isStatic) {
//       options = item.options;
//     }

//     return this.generateProps(item)(
//       <Cascader
//         options={options}
//         notFoundContent={options ? '无加载选项' : '加载中...'}
//         fieldNames={item.fieldNames}
//         placeholder={item['placeholder']}
//         // loadData={loadData}
//         onChange={(e: any) => this.visibleChange(e, item)}
//         onPopupVisibleChange={(isCompose) => fetchOptions(isCompose, isAsync, item)}
//         changeOnSelect // 选择即改变
//       />
//     );
//   }

//   /*
//   *  -- 选择Radio、Checkbox组件 --
//   *  @param {function} formRadioHive - 构建radio组件
//   *  @param {function} formCheckboxHive - 构建checkbox组件
//   * */

//   formRadioHive = (item?: any) => {
//     return this.generateProps(item)(
//       <RadioGroup onChange={(e: any) => this.visibleChange(e, item)}>
//         {
//           item['options'].map((op: { value: string | number | undefined; label: React.ReactNode; }) => <Radio key={op.value} value={op.value}>{op.label}</Radio>)
//         }
//       </RadioGroup>
//     )
//   }

//   formCheckboxHive = (item?: any) => {
//     return this.generateProps(item)(
//       <CheckboxGroup options={item['options']} onChange={(e: any) => this.visibleChange(e, item)} />
//     );
//   }

//   /**
//    * -- slider组件 --
//    */
//   formSliderHive = (item?: any) => {
//     return this.generateProps(item)(
//       <Slider {...item.options}></Slider>
//     )
//   }

//   /*
//   *  -- 按钮组件 --
//   * @param {function} formButtonGpHive - 默认按钮设置
//   * */

//   formButtonGpHive = (item?: any) => {
//     const buttons: object[] = [];
//     item['btns'].map((btn: object, index: number) => {
//       switch (btn['type']) {
//         case 'submit':
//           buttons.push(
//             <Button key={'submit'} type={'primary'} loading={this.state.subloading} htmlType="submit">{btn['text']}</Button>
//           );
//           break;
//         case 'reset':
//           buttons.push(
//             <Button key={'reset'} type={'dashed'} onClick={this.resetHandler}>{btn['text']}</Button>
//           );
//           break;
//         default:
//           buttons.push(
//             <Button type={'dashed'}>{btn['text'] || '默认按钮'}</Button>
//           );
//           break;
//       }
//     });
//     return buttons;
//   }

//   /*
//   *  -- 日期组件 --
//   *  @param {function} formDatePickerHive - 默认日期组件构建
//   * */

//   formDatePickerHive = (item?: any) => {

//     // 定义不可用日期范围
//     const disabledRange = (current: any) => {
//       if (item['rangeArray'] && current) {
//         return (current > moment().subtract(item['rangeArray'][1], item['rangeType'] || 'days'))
//           || (current < moment().subtract(item['rangeArray'][0], item['rangeType'] || 'days'));
//       } else {
//         return false;
//       }
//     }

//     const DateComponent: Function | undefined = this.dateTypeMap.get(item['childType']);
//     return DateComponent && this.generateProps(item)(<DateComponent
//       getPopupContainer={trigger => trigger.parentNode as HTMLElement}
//       disabledDate={disabledRange}
//       placeholder={item['placeholder']}
//       format={item['format']}
//       showTime={item['showTime']}
//       style={{ minWidth: item['width'] || 'auto' }}
//     />);
//   }

//   /*
//   *  -- 开关组件 --
//   *  @param {function} formSwitchHive - 默认构建开关组件
//   * */

//   formSwitchHive = (item?: any) => {
//     return this.generateProps(item)(<Switch onChange={(e: any) => this.visibleChange(e, item)} />)
//   }

//   // 自定义组件插件机
//   formPluginHive = (item) => {
//     const formOption = {
//       form: this.form,
//       param: item.param.name,
//       initialValue: item.defaultValue,
//       placeholder: item.placeholder,
//       visiblechange: (e, item) => this.visibleChange(e, item)
//     };
//     return this.generateProps(item)(<item.plugin
//       {...item.pluginOption}
//       {...formOption}
//       {...this.props}
//       ref={React.createRef()}
//     />)
//   }

//   initialForm() {

//     // form控件类型定义
//     this.formMap = new Map<string, Function>([
//       ['input', this.formInputHive],
//       ['select', this.formSelectHive],
//       ['btnGp', this.formButtonGpHive],
//       ['date', this.formDatePickerHive],
//       ['switch', this.formSwitchHive],
//       ['radio', this.formRadioHive],
//       ['cascader', this.formCascaderHive],
//       ['checkbox', this.formCheckboxHive],
//       ['slider', this.formSliderHive],
//       ['plugin', this.formPluginHive]
//     ]);

//     // 设置日期空间种类映射
//     this.dateTypeMap = new Map<string, Function>([
//       ['pickDate', DatePicker],
//       ['pickMonth', MonthPicker],
//       ['rangeDate', RangePicker]
//     ]);
//   }

//   /*
//   *  -- 按钮回调事件集 --
//   *  @param {function} submitValidate - 参数验证后提交
//   * */

//   submitValidate = (e: React.FormEvent) => {
//     e.preventDefault();

//     // 参数验证
//     this.form.validateFieldsAndScroll((err: Error, fieldsValue: object) => {
//       if (!!err) {
//         return;
//       }
//       this.setState({
//         subloading: !0
//       });

//       // 数据传递至父级
//       try {
//         let fieldsParam = this.props.config.defaultParams ? Object.assign(this.props.config.defaultParams, fieldsValue) : fieldsValue;
//         const fetchPromise = this.props.fetch(fieldsParam);
//         fetchPromise.then(() => {
//           this.resetForm();
//         }, () => {
//           this.setState({
//             subloading: !1
//           });
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     });
//   }

//   // 重置表单
//   resetForm() {
//     this.resetHandler();
//     this.setState({
//       subloading: !1
//     });
//   }

//   // 显示逻辑
//   computedVisible(item) {
//     if (Object.prototype.toString.call(item.visibleRule) === '[object Function]') {
//       return item.visibleRule(this.state.visible);
//     } else {
//       return true;
//     }
//   }

//   //可见性改变事件
//   visibleChange(e: any, item: object) {
//     let { visible } = this.state;
//     if (e !== null && e !== void 0) {
//       visible[item['param'] ? item['param'].name : item] = e.target ? e.target['value'] : e;
//     }
//     this.setState({
//       visible
//     });
//   }

//   // 重置Form
//   resetHandler = () => {
//     // 重置表单元素显示规则
//     this.state.visible = {};
//     this.form.resetFields();
//   }

//   render() {
//     console.time('form_render');
//     return (
//       <Form {...this.layout} onSubmit={this.submitValidate}>
//         {
//           this.props.config.items.map((item: any) => {
//             let hive: Function | undefined;
//             if (item.type) {
//               hive = this.formMap.get(item.type);
//             }
//             return item.wrap ? <div className={'jr-block'} key={item.key}></div> :
//               !!this.computedVisible(item) && <FormItem label={item.label} key={item.key}>
//                 {hive && hive(item)}
//               </FormItem>
//           }
//           )
//         }
//       </Form>
//     );
//   }

//   componentDidMount() {
//     console.timeEnd('form_render');
//   }

//   componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
//     console.timeEnd('form_render');

//     // 判断form实例是否变化
//     if (this.props.formId !== prevProps.formId) {
//       this.resetHandler();
//     }
//   }

//   componentDidCatch(e) {
//     console.log(e);
//   }
// }

// const FormCore = Form.create<IProps>()(Core);

// export default FormCore;