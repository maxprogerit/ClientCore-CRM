import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { CrmProvider } from "./store/CrmContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CrmProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CrmProvider>
  </React.StrictMode>
);
