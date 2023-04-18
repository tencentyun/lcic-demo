/* 页面 js 调整 */
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
    const style = isMobilePortrait ? `width: ${document.body.clientWidth}px; left: -${document.body.clientWidth - 130}px` : '';
    console.log('==============> update style ', style);
    document.querySelector('.video-wrap-component').style = style;
  }
}

function enterClassRoom() {
  // first time enter the class room update layout
  doUpdateNodeSize();
  // update back board  background
  const board = TCIC.SDK.instance.getBoard();
  board.setBackgroundColor('#fefefe');
  // board.setBackgroundColor('rgba(ff, 00, 00, 0.5)');
  // https://doc.qcloudtiw.com/web/official/TEduBoard.html#setBackgroundImage
  // board.setBackgroundImage(url, modeopt);

}
// dom load
pageReady((e) => {
  console.log('=======> Document is ready!');
  TCIC.SDK.instance.on(TCIC.TMainEvent.After_Enter, enterClassRoom);
  TCIC.SDK.instance.on(TCIC.TMainEvent.App_Resized, doUpdateNodeSize);
});
