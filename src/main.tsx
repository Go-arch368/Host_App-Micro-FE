import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./CSS/main.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import AppRoutes from "./AppRoutes";
import { NavigationProvider } from "./navigation/NavigationContext";

// Root render
const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* NavigationProvider captures every route change (including reload/back/forward) and passes a snapshot to remotes that opt into navigationContext. */}
      <NavigationProvider>
        <AppRoutes />
      </NavigationProvider>
    </BrowserRouter>
  </React.StrictMode>,
);