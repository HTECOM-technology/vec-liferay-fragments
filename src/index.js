import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ===== CRA DEV MODE =====
const devRoot = document.getElementById("root");
if (devRoot) {
  ReactDOM.createRoot(devRoot).render(<App />);
}

// ===== LIFERAY MODE =====
function renderApp(element) {
  const root = ReactDOM.createRoot(element);
  root.render(<App />);
}

window.ReactHelloWorldApp = {
  render: renderApp
};