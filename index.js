import './client.js';
var root = document.getElementById('root');
var input = document.createElement('input');
input.placeholder = '请输入手机号';
document.body.appendChild(input);

function render() {
 root.innerHTML = require('./hot.js').default;
}
render();

if (module.hot) {
 module.hot.accept(['./hot.js'], () => {
  render();
 });
}
