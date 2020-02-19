const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
 mode: 'development',
 entry: {
  app: './index.js'
 },
 devServer: {
  hot: true,
 },
 output: {
  path: path.join(__dirname, 'dist'),
  filename: 'main.js'
 },
 plugins: [
  new htmlWebpackPlugin({
   template: './index.html',
   title: '热更新'
  }),
  new webpack.HotModuleReplacementPlugin()
 ]
};
