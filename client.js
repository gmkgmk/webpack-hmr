var socket = io('/');
let currentHash = null;
let hotCurrentHash = null;
socket.on('hash', hash => {
 if (!hotCurrentHash) {
  hotCurrentHash = hash;
 }
 currentHash = hash;
});
socket.on('ok', () => {
 if (hotCurrentHash === currentHash) return;
 reloadApp(true);
});
function reloadApp(hot) {
 if (hot) {
  webpackHotUpdate();
 } else {
  window.location.reload();
 }
}

async function webpackHotUpdate() {
 console.log(__webpack_require__);
 const { c: chunk } = await hotDownloadManifest();
 let chunkIds = Object.keys(chunk);
 chunkIds.forEach(chunkId => {
  hotDownloadUpdateChunk(chunkId);
 });
 hotCurrentHash = currentHash;
}

function hotDownloadUpdateChunk(chunkId) {
 let script = document.createElement('script');
 script.charset = 'utf-8';
 // /main.xxxx.hot-update.js
 script.src = '/' + chunkId + '.' + hotCurrentHash + '.hot-update.js';
 document.head.appendChild(script);
}

// 此方法用来去询问服务器到底这一次编译相对于上一次编译改变了哪些chunk?哪些模块?
function hotDownloadManifest() {
 return new Promise(function(resolve) {
  let request = new XMLHttpRequest();
  //hot-update.json文件里存放着从上一次编译到这一次编译 取到差异
  let requestPath = '/' + hotCurrentHash + '.hot-update.json';
  request.open('GET', requestPath, true);
  request.onreadystatechange = function() {
   if (request.readyState === 4) {
    let update = JSON.parse(request.responseText);
    resolve(update);
   }
  };
  request.send();
 });
}
