// window.TCIC is global Function , It will be injected into the classRoom before user enter;
const tcic = window.TCIC || {};

const initEvent = () => {
  tcic.SDK.instance.promiseState(tcic.TMainState.Joined_Class, true).then(async () => {
    // if (tcic.SDK.instance.getClassInfo().classSubType == tcic.TClassSubType.Live) {
    // 加载班级码
    tcic.SDK.instance.loadComponent('classcode-component');
    // }
  });
};

export default {
  tcic,
  initEvent,
};
