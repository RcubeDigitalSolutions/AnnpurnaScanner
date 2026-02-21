import React, { useState } from 'react';
import Sidebar from './Sidebar';

const ProtectedLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
