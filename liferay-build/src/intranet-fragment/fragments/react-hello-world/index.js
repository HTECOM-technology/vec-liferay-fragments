const root = fragmentElement.querySelector('#react-root');

console.log('Fragment loaded');
console.log('React root:', root);
console.log('Global app:', window.ReactHelloWorldApp);

if (root && window.ReactHelloWorldApp) {
  window.ReactHelloWorldApp.render(root);
}