import React, { Suspense } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "sonner";
import "../styles/fonts.css";
import "../styles/theme.css";

function App() {
  return (
    <AppProvider>
      <div className="bg-[#000000] min-h-screen flex justify-center w-full relative selection:bg-amber-500/30 selection:text-amber-500">
        <Suspense
          fallback={
            <div className="w-full min-h-screen flex items-center justify-center text-text-muted">
              جاري التحميل...
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
        <Toaster
          position="bottom-center"
          toastOptions={{ className: "font-arabic" }}
        />
      </div>
    </AppProvider>
  );
}

export default App;
