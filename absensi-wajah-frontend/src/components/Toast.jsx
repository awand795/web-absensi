import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

const typeStyles = {
  success: { bg: '#7d9b76', icon: <FiCheckCircle size={18} /> },
  error: { bg: '#c94a4a', icon: <FiAlertCircle size={18} /> },
  warning: { bg: '#d4a853', icon: <FiInfo size={18} /> },
  info: { bg: '#7091a8', icon: <FiInfo size={18} /> },
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, duration, exiting: false }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = addToast(message, type, duration);
    return id;
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: '400px' }}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const s = typeStyles[toast.type] || typeStyles.info;

  useEffect(() => {
    const timer = setTimeout(onClose, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg transition-all duration-300 ${
        toast.exiting ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
      }`}
      style={{
        background: s.bg,
        color: 'white',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
        animation: toast.exiting ? 'none' : 'slideInRight 0.3s ease',
      }}>
      <span className="shrink-0 mt-0.5">{s.icon}</span>
      <p className="text-sm flex-1 leading-relaxed">{toast.message}</p>
      <button onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
        <FiX size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast: (msg, type) => console.log(`[Toast] ${type}: ${msg}`),
      removeToast: () => {},
    };
  }
  return ctx;
}

export default ToastProvider;
