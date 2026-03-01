import React, { useEffect, useState } from 'react';

const PlanExpiredModal = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handler = (e) => {
      setMessage(e.detail && e.detail.message ? e.detail.message : 'Your plan has expired. Contact the service provider for further details.');
      setOpen(true);
    };
    window.addEventListener('app-restaurant-disabled', handler);
    return () => window.removeEventListener('app-restaurant-disabled', handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-2 text-lg font-bold">Plan Expired</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanExpiredModal;
