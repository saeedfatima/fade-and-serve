import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Settings, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useDjangoAuth';
import ProfileManager from '@/components/ProfileManager';


const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = user?.first_name?.[0] + user?.last_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url ?? undefined} alt="User avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">Account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            {user?.first_name || user?.last_name ? (
              <span>{user.first_name} {user.last_name}</span>
            ) : (
              <span>{user?.email}</span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Profile & Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profile & Settings</DialogTitle>
            <DialogDescription>Manage your account info and profile photo.</DialogDescription>
          </DialogHeader>
          <ProfileManager />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;
