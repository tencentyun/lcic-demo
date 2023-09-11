const TCIC = window.TCIC;

const log = (...args) => console.log('sort plugin: ', ...args);
// 课堂加载成功后执行
log('sort plugin loaded');

/**
 * @typedef {object} VideoInstance
 * @property {boolean} isTeacherVideo
 * @property {boolean} isAssistantVideo
 * @property {string} nickname
 * @property {string} userId
 */

TCIC.SDK.instance.promiseState(TCIC.TMainState.Joined_Class, true).then(() => {
  
  const videoWall = TCIC.SDK.instance.getComponent('video-wall-component').getVueInstance().videoWall;
  // 默认为 true，如果设置为 false，teacher 不会锁定在首位
  videoWall.lockTeacher = false;

  /**
   * @returns {VideoInstance} 视频实例
   */
  const getVideoInstance = (item) => {
    if (!item) return;
    return item.dom.getVueInstance().$children.find(vm => vm.nickname !== undefined);
  }

  /**
   * 获取各角色的排序权重
   * @param {VideoInstance} video 
   */
  const getSortWeight = (video) => {
    if (video.isTeacherVideo) {
      return 10;
    }
    if (video.isAssistantVideo) {
      return 9;
    }
    // nickname 是异步的有可能是空字符串
    if (video.nickname.trim().indexOf('临床医生_') === 0) {
      return 7;
    } else if (video.nickname.trim().indexOf('患者') === 0) {
      return 6;
    } else if (video.nickname.trim().indexOf('培训医生_') === 0) {
      return 5;
    }
    return 0;
  }

  // 对 video 进行自定义排序
  videoWall.setSortFunc((item1, item2) => {
    const video1 = getVideoInstance(item1);
    const video2 = getVideoInstance(item2);
    // 权重大的排前边
    return getSortWeight(video2) - getSortWeight(video1);
  });

  let timer;

  // 由于获取 nickname 是异步的，自定义排序函数中有根据 nickname 进行排序的逻辑，则每次有新人加入后，延时 2 秒重新排序一下
  videoWall.setVideoAddCallBack(() => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      // 触发重新排序
      videoWall.updateRender();
      timer = null;
    }, 2000);
  })
});
