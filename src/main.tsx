import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { ErrorBoundary } from "./app/components/ErrorBoundary";
import "./styles/theme.css";
import logger from "./lib/logger";

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
        <h1>خطأ في تحميل التطبيق</h1>
        <p>يرجى إعادة تحميل الصفحة</p>
      </div>
    </div>
  `;
}
