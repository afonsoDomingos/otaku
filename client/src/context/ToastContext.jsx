import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast-item ${toast.type}`}>
                        <div className="toast-icon">
                            {toast.type === 'success' && <CheckCircle size={20} />}
                            {toast.type === 'error' && <XCircle size={20} />}
                            {toast.type === 'info' && <Info size={20} />}
                            {toast.type === 'warning' && <AlertTriangle size={20} />}
                        </div>
                        <div className="toast-message">{toast.message}</div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
                .toast-container {
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    pointer-events: none;
                }

                .toast-item {
                    pointer-events: auto;
                    min-width: 320px;
                    max-width: 450px;
                    background: #181818;
                    color: white;
                    padding: 16px 20px;
                    border-radius: 12px;
                    border: 1px solid #333;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    animation: slideInToast 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border-left: 5px solid transparent;
                }

                .toast-item.success { border-left-color: #4ade80; }
                .toast-item.error { border-left-color: #ff4444; }
                .toast-item.info { border-left-color: #3b82f6; }
                .toast-item.warning { border-left-color: #f59e0b; }

                .toast-icon { display: flex; align-items: center; justify-content: center; }
                .toast-item.success .toast-icon { color: #4ade80; }
                .toast-item.error .toast-icon { color: #ff4444; }
                .toast-item.info .toast-icon { color: #3b82f6; }
                .toast-item.warning .toast-icon { color: #f59e0b; }

                .toast-message { flex: 1; font-size: 0.95rem; font-weight: 500; line-height: 1.4; }
                .toast-close { background: none; border: none; color: #666; cursor: pointer; transition: color 0.3s; padding: 4px; }
                .toast-close:hover { color: #fff; }

                @keyframes slideInToast {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @media (max-width: 600px) {
                    .toast-container { right: 20px; left: 20px; top: auto; bottom: 30px; }
                    .toast-item { min-width: 0; width: 100%; }
                }
            `}</style>
        </ToastContext.Provider>
    );
};
