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
    const style = isMobilePortrait ? `width: ${document.body.clientWidth}px; left: -${document.body.clientWidth - 130}px`
      : 'width: 100%; height: 100%; position: static; overflow-x: hidden; overflow-y: auto;';
    console.log('==============> update style ', style);
    if (document.querySelector('.video-wrap-component') !== null) {
      document.querySelector('.video-wrap-component').style = style;
    }
    const imEle = document.querySelector('portrait-im-component.tcic-component-container');
    if (imEle) {
      const observerOptions = {
        childList: false,
        attributes: true,
      };

      const callback = (mutationList, observer) => {
        mutationList.forEach((mutation) => {
          switch (mutation.type) {
            case 'attributes':
              console.log('mutationName:', mutation.attributeName);
              if (mutation.attributeName === 'style') {
                if (imEle.style.top === 'calc(30% + 45px)') {
                  imEle.style.top = 'calc(30% + 135px)';
                  imEle.style.height = 'calc(70% - 135px)';
                }
              }
              break;
          }
        });
      };
      const observer = new MutationObserver(callback);
      observer.observe(imEle, observerOptions);
    }
  }
}

// dom load

function enterClassRoom() {
  // first time enter the class room update layout
  doUpdateNodeSize();

  // set backboard  background color or picture
  const board = TCIC.SDK.instance.getBoard();
  board.setBackgroundColor('#fefefe');
  // board.setBackgroundColor('rgba(ff, 00, 00, 0.5)');
  // Api document: https://doc.qcloudtiw.com/web/official/TEduBoard.html#setBackgroundImage
  // board.setBackgroundImage(url, modeopt);

}

// dom load
pageReady((e) => {
  console.log('=======> Document is ready!');
  TCIC.SDK.instance.on(TCIC.TMainEvent.After_Enter, enterClassRoom);
  TCIC.SDK.instance.on(TCIC.TMainEvent.App_Resized, doUpdateNodeSize);
});
