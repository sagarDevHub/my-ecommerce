import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SearchBar from './SearchBar';
import { Bell, Home } from 'lucide-react';
import ShoppingCartIcon from './ShoppingCartIcon';
import { Show, SignInButton } from '@clerk/nextjs';
import ProfileButton from './ProfileButton';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
      {/* LEFT */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="KubeCart"
          width={36}
          height={36}
          className="w-6 h-6 md:w-9 md:h-9"
        />
        <p className="hidden md:block text-md font-medium tracking-wider text-gray-900 dark:text-gray-100">
          KubeCart
        </p>
      </Link>
      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <SearchBar />
        <Link href="/">
          <Home className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" />
        </Link>
        <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer" />
        <ShoppingCartIcon />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Shown when user is logged out */}
        <Show when="signed-out">
          <SignInButton />
        </Show>

        {/* Shown when user is logged in */}
        <Show when="signed-in">
          <ProfileButton />
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;
