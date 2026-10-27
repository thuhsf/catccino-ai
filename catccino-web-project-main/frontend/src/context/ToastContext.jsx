import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { message, error }
  const timerRef = useRef(null);

  const showToast = useCallback((message, error = false) => {
    setToast({ message, error });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] max-w-[90vw] rounded-xl px-5 py-3 text-sm text-paper shadow-warm transition-all duration-200 ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        } ${toast?.error ? "bg-rust" : "bg-coffee-dark"}`}
      >
        {toast?.message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de um ToastProvider");
  return ctx;
}
