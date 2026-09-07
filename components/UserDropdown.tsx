"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import NavItems from "./NavItems";
import { signOut } from "@/lib/actions/auth.actions";

const UserDropdown = ({
  user,
  initialStocks,
}: {
  user: User;
  initialStocks: StockWithWatchlistStatus[];
}) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 text-gray-400 hover:text-yellow-500"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=Maria" />
            <AvatarFallback className="bg-yellow-500 text-sm font-bold text-yellow-900">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start md:flex">
            <span className="text-base font-medium text-gray-400">{user.name}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-400">
        <DropdownMenuLabel>
          <div className="relative flex items-center gap-3 py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=Maria" />
              <AvatarFallback className="bg-yellow-500 text-sm font-bold text-yellow-900">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-400">{user.name}</span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-md cursor-pointer font-medium text-gray-100 transition-colors focus:bg-transparent focus:text-yellow-500"
        >
          <LogOut className="mr-2 hidden h-4 w-4 sm:block" />
          Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator className="hidden bg-gray-600 sm:block" />
        <nav className="sm:hidden">
          <NavItems initialStocks={initialStocks} />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
