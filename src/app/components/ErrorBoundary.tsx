import React from "react";
import { AlertCircle } from "lucide-react";
import logger from "@/lib/logger";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
  },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error("ErrorBoundary caught an error", { error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-0 text-text-main flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-[32px] border border-border-subtle bg-surface-1 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold mb-2">حدث خطأ</h1>
            <p className="text-text-muted mb-6 leading-relaxed">
              حدث خطأ غير متوقع في التطبيق. الرجاء إعادة التحميل لمحاولة
              الاستمرار.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-bold text-stone-900 shadow-lg hover:opacity-90 transition-all"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
