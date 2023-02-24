// Modules to control application life and create native browser window
const electron = require('electron')
const {app, ipcMain, dialog} = require('electron')
const TCIC = require('tcic-electron-sdk')
const path = require('path')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const url = require('url')
const USER_HOME = process.env.HOME || process.env.USERPROFILE;

log.transports.file.level = 'debug';
log.transports.file.resolvePath = () => path.join(USER_HOME, 'tcic_log/main.log');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// 单实例
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  return;
} else {
  app.on('second-instance', (event, commandLine) => {
    // handleArgvFromWeb(commandLine);
    log.info('MAIN::second-instance=>' + commandLine);
    app.relaunch({
      args: commandLine
    });
    app.exit(0);
  })
}
const g_feedurl = "https://res.qcloudclass.com/Desktop/1.3.2/"
let _browserWindow;
let g_enter_url = null;

// 打开本地窗口加载
function createLCICWindow () {
  // Create the browser window.
  _browserWindow = new electron.BrowserWindow({
    width: 1296,
    height: 782,
    useContentSize: true,
    icon: __dirname+'/img/crdc.ico',
    // transparent: true,
    // frame: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
      autoHideMenuBar: true,      
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  electron.Menu.setApplicationMenu(null)
  
  // 一般情况是通过加载本地客户端的登录态或者远程请求动态登录态
  // _browserWindow.loadFile('index.html');
  _browserWindow.loadURL('https://class.qcloudclass.com/1.7.2/login.html?v=123');

  _browserWindow.setMenuBarVisibility(false)
  // Emitted when the window is closed.
  _browserWindow.on('closed', function () {
    _browserWindow.destroy();
    _browserWindow = null
  });

  // Custom
  electron.globalShortcut.register('CmdOrCtrl+F10', ()=>{
    _browserWindow && _browserWindow.webContents.openDevTools();
  });
  electron.globalShortcut.register('CmdOrCtrl+F5', ()=>{
    _browserWindow && _browserWindow.webContents.reload();
  });

  // 检测更新
  console.log("check update...");
  updateHandle();

}


electron.ipcMain.on('close-window', (event, params)=>{
  _browserWindow && _browserWindow.close();
});
 const version = '1.7.2';
electron.ipcMain.on('create-class', (event, arg)=>{
  if (arg.sign) {
    TCIC.initialize({
      sign: arg.sign,
      env: arg.env,
      lng: arg.lng,
      classSubType: arg.classSubType,
    });
  } else {
    TCIC.initialize({
      schoolId: arg.schoolId ? arg.schoolId : arg.schoolid,
      classId: arg.classId ? arg.classId : arg.classid,
      userId: arg.userId ?  arg.userId : arg.userid,
      token: arg.token,
      scene: '',
      version: version,
      env: arg.env,
      lng: arg.lng
    });
  }
  // TCIC.initialize({
  //   url: `http://localhost:8080/index.html?schoolid=${arg.schoolId}&classid=${arg.classId}&userid=${arg.userId}&token=${arg.token}`
  // })
  setTimeout(() => {    // 延时关闭登录窗口，避免应用直接退出
    _browserWindow.close();
    _browserWindow = null;
  }, 2000);
});

electron.ipcMain.on('onTCICWindowClose', () => {
  console.log('::onTCICWindowClose');
  TCIC.closeAllWindow();
  _browserWindow.close();
});

electron.ipcMain.on('onTCICClassStart', () => {
  console.log('::onTCICClassStart');
});

electron.ipcMain.on('onTCICClassStop', () => {
  console.log('::onTCICClassStop');
});

// 浏览器唤起
function enterClassWithUrl(enterUrl) {
  if (_browserWindow) {
    _browserWindow.close();
    _browserWindow = null;
  }

  let myUrl = url.parse(enterUrl);
  let urlParams = new url.URLSearchParams(myUrl.query);
  const innerKeys = ['classid', 'cid', 'uid', 'env', 'schoolid', 'userid', 'token', 'sign', 'env'];
  let customParams = 'x=1';
  log.info("MAIN::enterClassWithUrl=>url: " + JSON.stringify(urlParams));
  Array.from(urlParams.keys()).filter(key => {
    if (!innerKeys.includes(key)) {
      customParams += `&${key}=${urlParams.get(key)}`;
    }
  });
  log.info("MAIN::enterClassWithUrl=>customParams: " + customParams);
  let params = {};
  if (urlParams.has('sign')) {
    params.sign = urlParams.get('sign');
    if (urlParams.has('env')) {
      params.env = urlParams.get('env');
    }
  } else {
    params.schoolId = urlParams.get('schoolid');
    params.classId = urlParams.get('classid');
    params.userId = urlParams.get('userid');
    params.token = urlParams.get('token');
    if (urlParams.has('scene')) {
      params.scene = urlParams.get('scene');
    }
    if (urlParams.has('env')) {
      params.env = urlParams.get('env');
    }
  }
  params.customParams =  customParams;
  log.info('MAIN::enterClassWithUrl=>final: ' + JSON.stringify(params));
  TCIC.initialize(params);
  closeMainWin();
}

const PROTOCOL = 'tcic'; // 用户自定义

// window 系统中执行网页调起应用时，处理协议传入的参数
function handleArgvFromWeb(args) {
  if (!g_enter_url) {
    const prefix = `${PROTOCOL}:`;
    // 开发阶段，跳过前两个参数（`electron.exe .`）
    // 打包后，跳过第一个参数（`myapp.exe`）
    const offset = app.isPackaged ? 1 : 2;
    g_enter_url = args.find((arg, i) => i >= offset && arg.startsWith(prefix));
  }
  
  log.info('MAIN::handleArgvFromWeb=>' + g_enter_url);
  if (g_enter_url){
    enterClassWithUrl(g_enter_url);
  }else{
    createLCICWindow();
  }
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.commandLine.appendSwitch("--disable-http-cache");
electron.app.on('ready', () => {
  handleArgvFromWeb(process.argv);
})

// Quit when all windows are closed. 外部窗口关闭
electron.app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  log.info('MAIN::window-all-closed=>enter');
  electron.app.quit()
})

electron.app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  //if (_browserWindow === null) createLCICWindow()
  if (_browserWindow){
    _browserWindow.focus();
  }else{
    TCIC.focus();
  }
})

app.on('open-url', (event, urlStr)=>{
  log.info('MAIN::open-url=>' + urlStr);
  g_enter_url = urlStr;
  let commandLine = [];
  let hasUrl = false;
  process.argv.forEach(line => {
    if (line.startsWith('tcic:')){
      commandLine.push(urlStr);
      hasUrl = true;
    } else {
      commandLine.push(line);
    }
  })
  if (!hasUrl) {
    commandLine.push(urlStr);
  }
  log.info('MAIN::open-url=>relaunch: ' + commandLine);
  app.relaunch({
    args: commandLine
  });
  app.exit(0);
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
electron.app.commandLine.appendSwitch('disable-site-isolation-trials');


// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  };

  autoUpdater.setFeedURL(g_feedurl);
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error, error.message)
  });
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  });
  autoUpdater.on('update-available', function (info) {
    //sendUpdateMessage(message.updateAva)
    const options = {
      type: 'info',
      title: '检测到更新',
      message: '客户端检测到新的版本，是否马上更新\n'+info.releaseNotes,
      buttons: ['立即更新', '取消']
    }
    dialog.showMessageBox(options, function(index){
      if (index == 0){
        autoUpdater.downloadUpdate();
        _browserWindow && _browserWindow.webContents.send('lock-update');
      }
    }) 
  });
  autoUpdater.on('update-not-available', function (info) {
    //sendUpdateMessage(message.updateNotAva)
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    _browserWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    const options = {
      type: 'info',
      title: '新版本下载完成',
      message: '点击确定马上安装新版本',
      buttons: ['确定']
    }
    dialog.showMessageBox(options, function(index){
      autoUpdater.quitAndInstall();
    })
  });

  autoUpdater.checkForUpdates();
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text, detail=""){
  _browserWindow && _browserWindow.webContents.send('message', text, detail);
}