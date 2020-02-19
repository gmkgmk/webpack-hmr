var express = require('express');
var app = express();
var http = require('http').createServer(app);
var socket = require('socket.io')(http);
var webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const config = require('./webpack.config');
const compiler = webpack(config);

init(compiler);

function init(compiler) {
 const { done } = compiler.hooks;
 //  监听完成时间
 done.tap('webpack-server-tap', state => {
  console.log('state: ', state.hash);
  socket.emit('hash', state.hash);
  socket.emit('ok');
 });
 //  监听编译改变
 compiler.watch({}, err => {
  console.log('又一次编译任务成功完成了');
 });

 app.use(middleware);
}

http.listen(8000, function() {
 console.log('listening on *:8000');
});

function middleware(req, res, next) {
 if (req.url === '/favicon.ico') {
  return res.sendStatus(404);
 }
 // /index.html   dist/index.html
 let filename = path.join(config.output.path, req.url.slice(1));
 let stat = fs.statSync(filename);
 if (stat.isFile()) {
  res.statusCode = res.statusCode || 200;
  res.sendFile(filename);
 }
}
