import React, { useMemo } from "react";
import { MessageCircle, Phone, Mail, Send, MapPin } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { AnimatedPage } from "../components/AnimatedPage";
import { motion } from "motion/react";
import { CONTACT } from "../config/contact";

export function ContactPage() {
  const { t, contactInfo } = useAppContext();

  const contactMethods = useMemo(
    () => [
      {
        icon: MessageCircle,
        label: "contact_whatsapp",
        value: contactInfo?.whatsapp || CONTACT.whatsapp,
        action: `https://wa.me/${(contactInfo?.whatsapp || CONTACT.whatsapp).replace(/\D/g, "")}`,
        color: "from-green-400 to-green-600",
        bgGlow: "bg-green-500/20",
      },
      {
        icon: Phone,
        label: "contact_phone",
        value: contactInfo?.phone || CONTACT.phone,
        action: `tel:${(contactInfo?.phone || CONTACT.phone).replace(/\D/g, "")}`,
        color: "from-blue-400 to-blue-600",
        bgGlow: "bg-blue-500/20",
      },
      {
        icon: Mail,
        label: "contact_email",
        value: contactInfo?.email || CONTACT.email,
        action: `mailto:${contactInfo?.email || CONTACT.email}`,
        color: "from-purple-400 to-purple-600",
        bgGlow: "bg-purple-500/20",
      },
    ],
    [contactInfo],
  );

  return (
    <AnimatedPage className="pt-2 pb-28">
      {/* Header */}
      <div className="px-5 pt-8 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-6 rounded-[24px] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)]"
        >
          <Send className="w-10 h-10 text-stone-900" strokeWidth={2} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-text-main mb-2"
        >
          {t("contact_title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-text-muted text-sm"
        >
          {t("contact_subtitle")}
        </motion.p>
      </div>

      <main className="flex-1 px-5">
        {/* Description Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 p-6 rounded-[24px] bg-surface-1 border border-border-subtle"
        >
          <p className="text-text-main text-center leading-relaxed">
            {t("contact_desc")}
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="space-y-4">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.label}
              href={method.action}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="block group"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t(method.label)}: ${method.value}`}
            >
              <div className="relative overflow-hidden rounded-[24px] bg-surface-1 border border-border-subtle p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">
                {/* Background Glow Effect */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${method.bgGlow} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10 flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-[18px] bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg`}
                  >
                    <method.icon
                      className="w-7 h-7 text-white"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <h3 className="text-text-main font-bold text-base mb-1">
                      {t(method.label)}
                    </h3>
                    <p className="text-text-muted text-sm">{method.value}</p>
                  </div>

                  {/* Arrow */}
                  <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                    <Send className="w-4 h-4 text-text-muted group-hover:text-stone-900 transition-colors rotate-180" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 text-center"
        >
          <p className="text-text-muted text-xs flex items-center justify-center gap-2">
            <MapPin className="w-3 h-3 text-text-muted" aria-hidden="true" />
            السويداء، سوريا
          </p>
          <p className="text-text-muted text-xs mt-1">
            نستقبل استفساراتكم على مدار الساعة
          </p>
        </motion.div>
      </main>
    </AnimatedPage>
  );
}
