import { StrictMode } from "react";
// import { Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/system";

import App from "@/App";
import { routerStore } from "@/stores";
import "@/index.css";
import Router from "@/components/Router";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <NextUIProvider className="blue-dark h-full text-foreground bg-background">
      <Router routerStore={routerStore}>
        <App />
      </Router>
    </NextUIProvider>
  </StrictMode>,
);
