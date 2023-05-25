/*
* Page JavaScript Events and Logic Used to Monitor Event Logic in Pages
* 页面 javascript 事件与逻辑用于监控页面中事件逻辑
* 페이지 javascript 이벤트와 논리는 페이지의 이벤트 논리를 감시하는 데 사용됩니다
* ページjavascriptイベントとロジックページ内のイベントロジックを監視するために使用する
*
* */
function pageReady(callback) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(callback, 0);
  } else { // 'loading'
    const proxy = function (e) {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        document.removeEventListener('readystatechange', proxy);
        callback();
      }
    };
    document.addEventListener('readystatechange', proxy);
  }
}

function doUpdateNodeSize() {
  console.log('=========> need update node style');
  const isMobileDevice = TCIC.SDK.instance.isMobile();
  const isMobileNative = TCIC.SDK.instance.isMobileNative();
  if (isMobileDevice && !isMobileNative) {
    const isMobilePortrait = !!((window.orientation === 180 || window.orientation === 0));
    const style = isMobilePortrait ? `width: ${document.body.clientWidth}px; left: -${document.body.clientWidth - 130}px;`
      : 'position: relative;';
    const el = document.querySelector('.video-wrap-component');
    if (el) {
      el.style = style;
    }
    console.log('==============> update style ', style);
  }
}

// dom load

function enterClassRoom() {
  // first time enter the class room update layout
  doUpdateNodeSize();

  // set backboard  background color or picture
  // if (TCIC.SDK.instance.isTeacher()) {
  // const board = TCIC.SDK.instance.getBoard();
  // board.setBackgroundColor('#fefefe');
  // board.setBackgroundColor('rgba(ff, 00, 00, 0.5)');
  // Api document: https://doc.qcloudtiw.com/web/official/TEduBoard.html#setBackgroundImage
  // board.setBackgroundImage(url, modeopt);
  // }
}

// dom load
pageReady((e) => {
  console.log('=======> Document is ready!');
  TCIC.SDK.instance.on(TCIC.TMainEvent.After_Enter, enterClassRoom);
  TCIC.SDK.instance.on(TCIC.TMainEvent.App_Resized, doUpdateNodeSize);
});
