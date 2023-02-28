import ClassCode from '@/components/homework-component/ClassCode';
import sdk from '@/utils/sdk.js';
const TCIC = sdk.tcic;
/**
 * 初始化组件
 * @param Vue
 * @param comName 组件名称
 * @param com  vue组件
 * @param _description 组件描述
 * @param immediatelyShow 立即显示
 * @returns {Promise<void>}
 */
const initHelpCom = async (Vue, comName, com, immediatelyShow = true) => {
  // 1. 注册自定义标签
  Vue.customElement(comName, com);
  // 2. 注册自定义组件
  TCIC.SDK.registerComponent(comName, com);
  // 3. 加载自定义组件
  if (immediatelyShow) {
    TCIC.SDK.instance.loadComponent(comName, {});
  }
};
export default {
  /**
   * 初始化组件
   * @param Vue
   */
  initComponent: async (Vue) => {
    if (window.Vue) {
      const initComs = [
        initHelpCom(Vue, 'classcode-component', ClassCode, false),
      ];
      await Promise.all(initComs);
    }
  },
  initHelpCom,
};
