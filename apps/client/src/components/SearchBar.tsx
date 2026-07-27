import { Search } from 'lucide-react';
import React from 'react';

const SearchBar = () => {
  return (
    <div className="hidden sm:flex items-center gap-2 rounded-md ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-900 px-2 py-1 shadow-md">
      <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <input
        id="search"
        placeholder="Search..."
        className="text-sm outline-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  );
};

export default SearchBar;
