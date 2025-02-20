"use client";
import { useState, useEffect } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Input,
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  ClockIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const CustomNavbar = ({ layout, page }) => {
  const [fixedNavbar, setFixedNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setFixedNavbar(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        {/* Breadcrumbs & Page Title */}
        <div className="capitalize">
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal opacity-50"
          >
            <Link
              href={`/${layout}`}
              className="hover:text-blue-500 hover:opacity-100"
            >
              {layout}
            </Link>{" "}
            / {page}
          </Typography>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>

        {/* Right Side: Search, Menu, Notifications */}
        <div className="flex items-center">
          {/* Search Bar */}
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>

          {/* Mobile Menu Icon */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {/* Sign In Button */}
          <Link href="/auth/sign-in">
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" /> Sign In
            </Button>
          </Link>

          {/* Notifications Menu */}
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar src="/images/avatar.jpg" alt="User" size="sm" />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* Settings Button */}
          <IconButton variant="text" color="blue-gray">
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
