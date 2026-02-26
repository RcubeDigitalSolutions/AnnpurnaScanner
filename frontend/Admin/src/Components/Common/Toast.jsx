import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3500 }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(), duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const bg = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-slate-700';

  return (
    <div className={`fixed right-4 top-6 z-50 ${bg} text-white px-4 py-2 rounded shadow`}>{message}</div>
  );
};

export default Toast;
