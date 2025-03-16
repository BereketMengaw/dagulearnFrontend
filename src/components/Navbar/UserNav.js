"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const CreatorDropdown = () => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="hover:text-blue-500 cursive-regular">
          Creator
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid gap-3 p-4 w-48">
            <ListItem href="/creator-dashboard/register" title="Creator Info" />
            <ListItem href="/creator-dashboard" title="Creator Dashboard" />
            <ListItem href="/creator-agreement" title="Creator Agreement" />
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

const AvatarDropdown = ({ userName, onLogout }) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="focus:outline-none">
          <div className="flex items-center space-x-2">
            <span className="text-black cursive-regular">
              Hello, {userName}
            </span>
            <span
              role="img"
              aria-label="avatar"
              className="text-2xl bg-gray-200 rounded-full p-2 text-gray-800"
            >
              🧑‍🎓
            </span>
          </div>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid gap-3 p-4 w-48">
            <ListItem href="/dashboard" title="Dashboard" />
            <li>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-600 hover:text-white rounded-md"
              >
                Logout
              </button>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

const UserNavigation = ({ userData, userName, setUserData, setUserName }) => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserData(null); // Clear user data
    setUserName("Guest"); // Reset username
  };

  return (
    <>
      {/* Show "Creator" button only for logged-in users with role "creator" */}
      {userData && userData.role === "creator" && <CreatorDropdown />}

      {/* Show "Hello, [Name]" and avatar dropdown for logged-in users */}
      {userData && (
        <AvatarDropdown userName={userName} onLogout={handleLogout} />
      )}
    </>
  );
};

export default UserNavigation;
