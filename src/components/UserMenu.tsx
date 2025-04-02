
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { LogOut, User, UserCog } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const UserMenu = () => {
  const { user, profile, signOut, isSigningOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link to="/login">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-ocean hover:bg-ocean-dark text-white" size="sm">
            Sign up
          </Button>
        </Link>
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || user.email || 'User'} />
            <AvatarFallback className="bg-ocean text-white">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/dashboard">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/profile">
          <DropdownMenuItem>
            <UserCog className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
