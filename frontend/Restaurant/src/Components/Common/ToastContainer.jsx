import React, { useEffect, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((e) => {
    const detail = e.detail || {};
    setToast({ message: detail.message || 'Notification', type: detail.type || 'info' });
  }, []);

  useEffect(() => {
    window.addEventListener('app-toast', showToast);
    return () => window.removeEventListener('app-toast', showToast);
  }, [showToast]);

  if (!toast) return null;

  return (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  );
};

export default ToastContainer;
