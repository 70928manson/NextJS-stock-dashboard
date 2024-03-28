'use client';

import { AiOutlineSearch } from 'react-icons/ai';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Searchbar({ placeholder }: { placeholder: string }) {
    const [searchWord, setSearchWord] = useState("");

    const router = useRouter();


    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    }

    const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const handleSearch = useDebouncedCallback(() => {
        router.push(`/stocks/${searchWord}`);
        setSearchWord("");
    }, 300);

    return (
        <div className="relative flex flex-1 flex-shrink-0 mr-4 mt-1 w-full">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 placeholder:text-sm"
                placeholder={placeholder}
                value={searchWord}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchInputKeyDown}
            />
            <AiOutlineSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    );
}
