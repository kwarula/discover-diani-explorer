import React from 'react';
import AdminHeader from './AdminHeader'; // Placeholder, will create next
import AdminSidebar from './AdminSidebar'; // Placeholder, will create next

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-800/50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
