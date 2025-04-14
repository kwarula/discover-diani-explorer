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
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard }, // Added /dashboard
  { to: '/admin/dashboard/operators', label: 'Operators', icon: Users }, // Added /dashboard
  { to: '/admin/dashboard/listings', label: 'Listings', icon: Building }, // Added /dashboard
  { to: '/admin/dashboard/users', label: 'Users', icon: User }, // Added /dashboard
  { to: '/admin/dashboard/moderation', label: 'Moderation', icon: ShieldAlert }, // Added /dashboard
  { to: '/admin/dashboard/points-of-interest', label: 'Points of Interest', icon: MapPin }, // Added /dashboard and updated path
  { to: '/admin/dashboard/analytics', label: 'Analytics', icon: BarChart }, // Added /dashboard
  // { to: '/admin/settings', label: 'Settings', icon: Settings }, // Optional
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 dark:border-gray-700 md:flex">
      {/* Sidebar Header/Logo */}
      <div className="mb-6 flex h-16 items-center justify-center border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-primary">Admin Panel</h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1"> {/* Reduced gap */}
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'} // Ensure exact match for Overview
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground', // Adjusted styling
                isActive && 'bg-accent text-accent-foreground' // Simplified active state
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      {/* Logout Button */}
      <div className="mt-auto border-t pt-4 dark:border-gray-700"> {/* Added border */}
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground" // Adjusted styling
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
