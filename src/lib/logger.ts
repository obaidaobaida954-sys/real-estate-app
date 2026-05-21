/**
 * Centralized logging system
 * Logs with timestamps and severity levels
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  data?: unknown;
  stack?: string;
}

const isDevelopment = import.meta.env.DEV;
const logHistory: LogEntry[] = [];
const MAX_LOGS = 100;

const getTimestamp = (): string => {
  return new Date().toISOString();
};

const addToHistory = (entry: LogEntry) => {
  logHistory.push(entry);
  if (logHistory.length > MAX_LOGS) {
    logHistory.shift();
  }
};

const formatMessage = (
  level: LogLevel,
  message: string,
  data?: unknown,
): string => {
  const prefix = `[${level.toUpperCase()}] ${getTimestamp()}`;
  if (data) {
    return `${prefix} - ${message}`;
  }
  return `${prefix} - ${message}`;
};

const logger = {
  /**
   * Log informational messages
   */
  info: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      level: "info",
      timestamp: getTimestamp(),
      message,
      data,
    };
    addToHistory(entry);

    if (isDevelopment || import.meta.env.VITE_DEBUG_LOGS === "true") {
      console.log(
        `%c${formatMessage("info", message)}`,
        "color: #22c55e; font-weight: bold;",
        data,
      );
    }
  },

  /**
   * Log warning messages
   */
  warn: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      level: "warn",
      timestamp: getTimestamp(),
      message,
      data,
    };
    addToHistory(entry);

    console.warn(
      `%c${formatMessage("warn", message)}`,
      "color: #f59e0b; font-weight: bold;",
      data,
    );
  },

  /**
   * Log error messages with optional error object
   */
  error: (message: string, error?: unknown) => {
    let errorData: unknown = error;
    let stack: string | undefined;

    if (error instanceof Error) {
      errorData = {
        name: error.name,
        message: error.message,
        ...error,
      };
      stack = error.stack;
    }

    const entry: LogEntry = {
      level: "error",
      timestamp: getTimestamp(),
      message,
      data: errorData,
      stack,
    };
    addToHistory(entry);

    console.error(
      `%c${formatMessage("error", message)}`,
      "color: #ef4444; font-weight: bold;",
      errorData,
    );

    // في المستقبل: إرسال للـ error tracking service
    if (
      error instanceof Error &&
      import.meta.env.VITE_ERROR_TRACKING === "true"
    ) {
      // logToExternalService(entry);
    }
  },

  /**
   * Log debug messages (development only)
   */
  debug: (message: string, data?: unknown) => {
    if (!isDevelopment) return;

    const entry: LogEntry = {
      level: "debug",
      timestamp: getTimestamp(),
      message,
      data,
    };
    addToHistory(entry);

    console.debug(
      `%c${formatMessage("debug", message)}`,
      "color: #8b5cf6; font-weight: bold;",
      data,
    );
  },

  /**
   * Get log history
   */
  getHistory: (): LogEntry[] => {
    return [...logHistory];
  },

  /**
   * Clear log history
   */
  clearHistory: () => {
    logHistory.length = 0;
  },

  /**
   * Export logs as JSON
   */
  export: (): string => {
    return JSON.stringify(logHistory, null, 2);
  },
};

export default logger;
