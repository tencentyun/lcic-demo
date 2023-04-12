export default {
  methods: {
    /**
     * 在确定已加入课堂后触发回调
     * @param callback 在确定已进入房间后触发该回调
     */
    makeSureClassJoined(callback) {
      if (callback) {
        this.$TCIC.SDK.instance.promiseState(this.$TCIC.TMainState.Joined_Class, true).then(callback);
      }
    },
    /**
     * @param callback 方法在设备检测完成后执行
     */
    deviceCheckComplete(callback) {
      if (callback) {
        this.$TCIC.SDK.instance.subscribeState('TStateDeviceDetect', async (detecting) => {
          console.log('######设备检测状态#######', detecting);
          if (!detecting) {
            callback();
          }
        });
      }
    },
  },
};
