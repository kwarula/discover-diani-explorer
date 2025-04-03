
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

interface UserMenuProps {
  className?: string; // Add className prop
}

const UserMenu: React.FC<UserMenuProps> = ({ className }) => {
  const { user, profile, signOut, isLoading } = useAuth();

  if (isLoading) {
    return <Button variant="ghost" size="sm" disabled className={className}>Loading...</Button>;
  }

  if (!user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button asChild variant="ghost" size="sm">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/register">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <User className="h-4 w-4 mr-2" />
          {profile?.full_name || 'Account'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
