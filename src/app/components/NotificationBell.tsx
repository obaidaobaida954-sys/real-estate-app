import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { relativeDate } from "../utils/date";

export function NotificationBell() {
  const { lang, notifications, t } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem("readNotifications");
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed)) {
          setReadNotifications(new Set(parsed));
        }
      }
    } catch {
      /* ignore corrupt read state */
    }
  }, []);

  const unreadCount = notifications.filter(
    (n) => !readNotifications.has(n.id),
  ).length;

  const markAsRead = (id: string) => {
    const newRead = new Set(readNotifications);
    newRead.add(id);
    setReadNotifications(newRead);
    localStorage.setItem(
      "readNotifications",
      JSON.stringify(Array.from(newRead)),
    );
  };

  const markAllAsRead = () => {
    const newRead = new Set(notifications.map((n) => n.id));
    setReadNotifications(newRead);
    localStorage.setItem(
      "readNotifications",
      JSON.stringify(Array.from(newRead)),
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full bg-surface-1 border border-border-subtle flex items-center justify-center hover:bg-surface-2 transition-all"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={t("nav_notifications")}
      >
        <Bell className="w-5 h-5 text-text-main" strokeWidth={2} />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-black"
          >
            {unreadCount}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-12 ${lang === "ar" ? "left-0" : "right-0"} w-96 max-w-[calc(100vw-2rem)] max-h-96 bg-surface-1/95 backdrop-blur-xl border border-border-subtle rounded-2xl shadow-2xl overflow-hidden z-50`}
            >
              <div className="flex items-center justify-between p-4 border-b border-border-subtle">
                <h3 className="text-text-main font-bold">
                  {t("nav_notifications")}
                </h3>
                <motion.div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-amber-500 hover:text-amber-400 font-medium"
                    >
                      {t("mark_all_read")}
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-6 h-6 rounded-full hover:bg-surface-2 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                </motion.div>
              </div>

              <motion.div className="max-h-80 overflow-y-auto p-1">
                {notifications.length === 0 ? (
                  <motion.div className="p-8 text-center text-text-muted text-sm">
                    {t("no_notifications")}
                  </motion.div>
                ) : (
                  notifications.map((notification) => {
                    const isRead = readNotifications.has(notification.id);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => markAsRead(notification.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            markAsRead(notification.id);
                          }
                        }}
                        className={`p-5 border-b border-border-subtle/30 cursor-pointer transition-colors ${
                          !isRead
                            ? "bg-amber-500/5 hover:bg-amber-500/10"
                            : "hover:bg-surface-2"
                        }`}
                      >
                        <motion.div className="flex items-start gap-3">
                          {!isRead && (
                            <motion.div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                          )}
                          <motion.div className={`flex-1 ${lang === "ar" ? "text-right" : "text-left"}`}>
                            <h4
                              className={`text-base font-bold mb-1 ${!isRead ? "text-text-main" : "text-text-sub"}`}
                            >
                              {notification.title}
                            </h4>
                            <p className="text-sm text-text-muted leading-relaxed mb-1 whitespace-normal break-words">
                              {notification.message}
                            </p>
                            {notification.createdAt && (
                              <p className="text- [11px] text-text-muted opacity-70 mt-2">
                                {relativeDate(notification.createdAt, lang)}
                              </p>
                            )}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
