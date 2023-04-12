import VueLocal from 'vue';
import components from './utils/components.js';
import sdk from './utils/sdk.js';
const Vue = window.Vue || VueLocal;
Vue.prototype.$TCIC = sdk.tcic;

components.initComponent(Vue);
sdk.initEvent();

