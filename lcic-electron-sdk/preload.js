// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { ipcRenderer } = require('electron');

window.joinClass = (params) => {
  ipcRenderer.send("create-class", params);
};
window.joinClassBySign = (params) => {
  ipcRenderer.send("create-class", params);
};


// 非必须代码，用于检测DOM 加载性能。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
