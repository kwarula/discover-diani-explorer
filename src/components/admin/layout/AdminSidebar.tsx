import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building, // Using Building for Listings, could also use List
  User,
  ShieldAlert,
  BarChart,
  Settings,
  LogOut,
  MapPin, // Import MapPin icon for POI
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Assuming you have this utility

// TODO: Replace with actual logout functionality from auth context
const handleLogout = () => {
  console.log('Logout clicked from sidebar');
  // Add logout logic here
};

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/operators', label: 'Operators', icon: Users },
  { to: '/admin/listings', label: 'Listings', icon: Building },
  { to: '/admin/users', label: 'Users', icon: User },
  { to: '/admin/moderation', label: 'Moderation', icon: ShieldAlert },
  { to: '/admin/poi', label: 'Points of Interest', icon: MapPin }, // Add POI nav item
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart },
  // { to: '/admin/settings', label: 'Settings', icon: Settings }, // Optional
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden w-64 flex-col border-r bg-white p-4 dark:bg-gray-800 dark:border-gray-700 md:flex">
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'} // Ensure exact match for Overview
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50',
                isActive && 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-50'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      {/* Logout Button */}
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
