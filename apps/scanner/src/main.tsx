import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { init } from "./store";

await init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
