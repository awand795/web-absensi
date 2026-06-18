import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

const typeStyles = {
  error: { bg: 'rgba(201,74,74,0.08)', border: 'rgba(201,74,74,0.2)', color: '#c94a4a', icon: <FiAlertCircle size={16} /> },
  warning: { bg: 'rgba(212,168,83,0.08)', border: 'rgba(212,168,83,0.2)', color: '#d4a853', icon: <FiInfo size={16} /> },
  info: { bg: 'rgba(112,145,168,0.08)', border: 'rgba(112,145,168,0.2)', color: '#7091a8', icon: <FiInfo size={16} /> },
  success: { bg: 'rgba(125,155,118,0.08)', border: 'rgba(125,155,118,0.2)', color: '#7d9b76', icon: <FiCheckCircle size={16} /> },
};

const Alert = ({ type = 'info', children, onClose }) => {
  const s = typeStyles[type] || typeStyles.info;
  if (!children) return null;
  return (
    <div className="flex items-start gap-2.5 p-3.5 rounded-xl border" style={{ background: s.bg, borderColor: s.border }}>
      <span className="mt-0.5 shrink-0" style={{ color: s.color }}>{s.icon}</span>
      <p className="text-sm font-medium flex-1" style={{ color: s.color }}>{children}</p>
      {onClose && (
        <button onClick={onClose} className="shrink-0 mt-0.5 transition-opacity hover:opacity-70" style={{ color: s.color }}>
          <FiX size={14} />
        </button>
      )}
    </div>
  );
};

export default Alert;
