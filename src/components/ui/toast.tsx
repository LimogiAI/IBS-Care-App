import React from "react";
import { createContext, useContext, useState } from "react";

interface Toast {
  title: string;
  description: string;
  variant?: "default" | "success" | "destructive";
}

const ToastContext = createContext<{
  toast: (toast: Toast) => void;
}>({
  toast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (newToast: Toast) => {
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000); // Auto-dismiss after 3 seconds
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((t, index) => (
          <div
            key={index}
            className={`p-4 rounded shadow-lg ${
              t.variant === "success"
                ? "bg-green-500 text-white"
                : t.variant === "destructive"
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            <h4 className="font-bold">{t.title}</h4>
            <p>{t.description}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);