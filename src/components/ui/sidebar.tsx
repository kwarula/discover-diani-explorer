import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import useMobile from '@/hooks/use-mobile'; // Fix import name
import { Link } from 'react-router-dom';

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (!isMobile) {
    return (
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
        <div className="flex-grow flex flex-col overflow-y-auto border-r bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="flex-grow p-4">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="flex-grow p-4">
            {children}
          </div>
          <div className="p-4 border-t dark:border-gray-700">
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Close Menu</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
