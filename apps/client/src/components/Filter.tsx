'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-end gap-2 text-sm text-gray-500 dark:text-gray-400 my-6">
      <span>Sort by:</span>
      <select
        name="sort"
        id="sort"
        className="ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md p-1 rounded-sm outline-none cursor-pointer"
        onChange={e => handleFilter(e.target.value)}
      >
        <option value="newest" className="bg-white dark:bg-gray-900">
          Newest
        </option>
        <option value="oldest" className="bg-white dark:bg-gray-900">
          Oldest
        </option>
        <option value="asc" className="bg-white dark:bg-gray-900">
          Price: Low to High
        </option>
        <option value="desc" className="bg-white dark:bg-gray-900">
          Price: High to Low
        </option>
      </select>
    </div>
  );
};

export default Filter;
