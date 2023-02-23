# TCIC-ELECTRON-SDK-DEMO 

Tencent Cloud Interactive Classroom SDK of Electron demo

【[腾讯云低代码互动课堂](https://cloud.tencent.com/document/product/1639)】是腾讯云整合音视频产品能力构建的 aPaaS 在线课堂解决方案。通过低代码互动课堂提供的 SDK 产品服务，开发者无需深度学习音视频的复杂核心逻辑，即可将低代码互动课堂 SDK 无缝嵌入到自己的业务系统中，搭建自有品牌的在线互动课堂。

本 Demo 仅用于演示 LCIC-ELECTRON-SDK 集成功能，源码对外开放，可供您接入时参考，但是 Demo 本身未经过严格测试，若您计划将 Demo 代码用于生产环境，请确保发布前自行进行充分测试，避免发生潜在问题可能给您造成损失。


# Demo 调试

## 安装与启动
```shell
npm install

## 启动demo
npm start

# 打包(windows/mac)
npm run builder-win
npm run builder-mac
```



## 2、开发集成注意事项

集成步骤分为四步。详细逻辑可以看 `main.js`

### 1、引入sdk与依赖包

```shell
npm install tcic-electron-sdk@1.7.2396

# other dependencies packages 
## electron
## electron-builder
```

### 2、 注册主应用进程

```javascript
const { app, ipcMain, dialog} = require('electron');
const TCIC = require('tcic-electron-sdk');


let _mainWindow; // 浏览窗口
let enterUrl = null;

const PRIVATE_PROTOCOL = 'tcic'; // private protocol for electron app

// window 系统中执行网页调起应用时，处理协议传入的参数
function handleArgvFromWeb(args) {
  if (!enterUrl) {
    const prefix = `${PROTOCOL}:`;
    // 开发阶段，跳过前两个参数（`electron.exe .`）
    // 打包后，跳过第一个参数（`myapp.exe`）
    const offset = app.isPackaged ? 1 : 2;
    enterUrl = args.find((arg, i) => i >= offset && arg.startsWith(prefix));
  }
  
  if (enterUrl){
    enterClassWithUrl(enterUrl); // 外部调起客户端可以直接进入课堂
  }else{
    createLCICWindow(); // 创建新窗口或进入主应用
  }
};

// initialization and is ready to create browser windows.
app.on('ready', () => {
  handleArgvFromWeb(process.argv);
})
//Quit when all windows are closed
app.on('window-all-closed', function () {
  app.quit()
})
// when window be
app.on('activate', function () {
  if (_mainWindow){
    _mainWindow.focus();
  } else {
    TCIC.focus();
  }
})
// call Native by private protocol url 
app.on('open-url', (event, urlStr)=>{
  enterClassWithUrl(urlStr);
})

 // 主进程时间监控
ipcMain.on('close-window', (event, params)=>{ /*TODO:*/ });
ipcMain.on('create-class', (event, arg)=>{/*TODO:*/ });
ipcMain.on('onTCICWindowClose', () => { /*TODO:*/ });
ipcMain.on('onTCICClassStart', () => { /*TODO:*/ });
ipcMain.on('onTCICClassStop', () => { /*TODO:*/ });


```

### 3、创建浏览窗口

```javascript
// 注册浏览窗口 [空内容窗口]
function createLCICWindow() {
    _browserWindow = new electron.BrowserWindow({
        width: 1296,
        height: 782,
        useContentSize: true,
        icon: __dirname+'/img/crdc.ico',
        hasShadow: false,
        webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,  // need open 
        preload: path.join(__dirname, 'preload.js'), // 浏览窗口加载前
        }
  });

  // 方式1：加载本地文件或客户端资源。本地处理用户登录、鉴权信息。
  // _browserWindow.loadFile('index.html'); 

  // 方式2： 网络加载远程页面，获取页面信息，通过服务端鉴权处理。
  _browserWindow.loadURL('https://www.qcloudclass.com/xxx/login.html');
  // 鉴权处理见第四点

}

// 主进程中 注册监听事件
ipcMain.on('create-class', (event, arg)=>{
    TCIC.initialize({
      schoolId: 111, // 学校id或sdkAppId [可选]
      classId: 222, // 课堂id，创建课堂后可获取
      userId: 'xxx', // 用户id, 注册接口可获取
      token: 'xxx', // 用户登录态信息换取
      scene: ''， // 打开模版样式 [可选]
      version: '1.7.2' // 打开空中课堂版本
    });
});
```

```javascript
// preload.js 窗口预加载并注册页面调用监听
const { ipcRenderer } = require('electron');

window.joinClassBySign = (params) => {
  ipcRenderer.send("create-class", params);
};

```

### 4、加载与调用

#### 方式1 ： 客户端通过进程间消息调用

```javascript
ipcRenderer.send("create-class", { classid, userid, token });
```

#### 方式2 :直接通过browser 加载进入课堂的页面(域名可以切换成业务方的域名)
```javascript

_browserWindow.loadURL(`https://class.qcloudclass.com/1.7.2/index.html/index.html?schoolid=${schoolId}&classid=${classId}&userid=${sign.UserId}&token=${sign.Token}&lng=${language}`)

```

#### 方式3 ，在_browserWindow 在的 html 页面中，通过鉴权或者其他操作直接调用 注册全局方法
```javascript

window.joinClassBySign({
    schoolid, classid, userid, token, lng,
});
```

#### 方式4 ：在浏览器拉起pc 客户端

【可以开发调试，不建议线上使用】 在浏览器中，通过链接跳转 或 window.open 方法打开。
```javascript

tcic://class.qcloudclass.com/1.7.2/index.html/index.html?schoolid=${schoolId}&classid=${classId}&userid=${sign.UserId}&token=${sign.Token}&lng=${language}
```


【推荐方式】中转页承接
业务侧可以通过中转页呼起客户端并进入课堂，兼容未下载客户端情况，如果用户不想下载可以跳转到web版本

![加载流程](https://qcloudimg.tencent-cloud.cn/image/document/2d325cd77c4e22f07145b331f9428a4c.png)

1、下载 [ElectronProtocolCheck.js](https://docs.qcloudclass.com/resources/ElectronProtocolCheck.js) 引入自己的项目中。

2、中转页中的代码

```javascript

import ElectronProtocolCheck from './ElectronProtocolCheck';

  const schoolId = 0000001;
  const classId  = 0000001;
  const userId = 'username'
  const token =  'xxxxxxxxxxxxxxxxxxx'
  const version = '1.7.2'; // 参见具体版本号
  const url = `tcic://class.qcloudclass.com/${version}/class.html?schoolid=${schoolId}&classid=${classId}&userid=${userId}&token=${token}`;
  console.log(`callClient->start: ${url}`);

  ElectronProtocolCheck(
    url,
    successCallBack: (res) => {
      // 呼起成功
      console.log('callClient->success! ');
    },
    failCallBack: (res) => {
      // 没有呼起来, 建议此处实现提示下载的弹窗

      // 如果用户点击下载 --> 换弹窗口信息，打开客户端。

      // 如果用户取消下载或关闭弹窗。在让用户尝试体验web/H5 版本的课堂
      // 也可以加上超时弹窗 一般 2500ms 内用户没有做出点击操作，可以出现模态点击框
    },
    unsupportedCallBack: () {
        // 浏览器不支持等情况，可以走web 链接加载
    }
  );
```

## 其他
