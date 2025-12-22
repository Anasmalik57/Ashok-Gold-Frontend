// app/dashboard/layout.js (or wherever your AdminLayout is)
'use client';

import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto pb-40">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;