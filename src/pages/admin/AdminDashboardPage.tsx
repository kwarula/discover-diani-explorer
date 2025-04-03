import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminLayout from '@/components/admin/layout/AdminLayout';
// TODO: Add authentication check here to protect this route

const AdminDashboardPage: React.FC = () => {
  // TODO: Implement logic to check if the user is an authenticated admin
  // If not authenticated or not an admin, redirect to login or show an error page.
  // For now, assume the user is authenticated.

  return (
    <AdminLayout>
      <Outlet /> {/* Renders the nested route component (e.g., AdminOverview) */}
    </AdminLayout>
  );
};

export default AdminDashboardPage;
