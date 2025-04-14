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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6 dark:border-gray-700"> {/* Use bg-background, add padding */}
      {/* Left Side: Mobile Sidebar Toggle (Optional) & Breadcrumbs/Title */}
      <div className="flex items-center gap-4">
        {/* Placeholder for potential mobile sidebar toggle */}
        {/* <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button> */}
        {/* We can add Breadcrumbs here later if needed */}
        <div className="hidden md:block">
          {/* Title can be dynamic based on page later */}
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        {/* Optional Global Search - Keep commented for now */}
        {/* <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div> */}
      </div>

      {/* Right Side: Notifications & User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <Button variant="outline" size="icon" className="rounded-full"> {/* Changed variant */}
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
          {/* TODO: Add badge for unread notifications */}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full"> {/* Changed variant */}
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
