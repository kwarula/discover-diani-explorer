import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react'; // Assuming lucide-react for icons

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input'; // For optional search

// TODO: Replace with actual auth context/hook
const userEmail = 'vinnieqruz@gmail.com'; // Placeholder

const AdminHeader: React.FC = () => {
  // TODO: Implement actual logout functionality
  const handleLogout = () => {
    console.log('Logout clicked');
    // Add logout logic here (e.g., call auth context method)
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-800 dark:border-gray-700">
      {/* Left Side: Logo/AppName & Optional Search */}
      <div className="flex items-center gap-4">
        <Link to="/admin" className="text-lg font-semibold text-gray-800 dark:text-white">
          Discover Diani Admin
        </Link>
        {/* Optional Global Search */}
        {/* <div className="relative ml-4 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search operators, listings..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div> */}
      </div>

      {/* Right Side: Notifications & User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
          {/* TODO: Add badge for unread notifications */}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                {/* TODO: Add actual user avatar source */}
                <AvatarImage src="/placeholder-user.jpg" alt="@vinnieqruz" />
                <AvatarFallback>VQ</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              Logged in as: {userEmail}
            </DropdownMenuItem>
            <DropdownMenuItem>
              {/* TODO: Link to profile settings if needed */}
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                View Live Site
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
