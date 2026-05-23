import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { ErrorBoundary } from "./app/components/ErrorBoundary";
import "./styles/index.css";
import "./styles/theme.css";
import logger from "./lib/logger";
import { translate } from "./lib/i18n-helpers";

const saved = localStorage.getItem("aqari_theme");
if (saved === "light") {
  document.documentElement.classList.remove("dark");
} else {
  document.documentElement.classList.add("dark");
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  logger.error("Root element not found in HTML");
  throw new Error(
    "Failed to find root element. Make sure #root exists in index.html",
  );
}

try {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>,
  );
  logger.info("Application started successfully");
} catch (error) {
  logger.error("Failed to render application", error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #666;">
      <div style="text-align: center;">
        <h1>${translate("app_load_error_title")}</h1>
        <p>${translate("app_load_error_message")}</p>
      </div>
    </div>
  `;
}
