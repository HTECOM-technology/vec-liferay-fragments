import ReactDOM from "react-dom/client";
import App from "./App";

function mountApp(element) {
  if (!element) {
    return;
  }

  element.classList.add("vec-react-fragment-root");
  ReactDOM.createRoot(element).render(<App />);
}

// ===== CRA DEV MODE =====
const devRoot = document.getElementById("root");
mountApp(devRoot);

// ===== LIFERAY MODE =====
function renderApp(element) {
  mountApp(element);
}

window.ReactHelloWorldApp = {
  render: renderApp
};
