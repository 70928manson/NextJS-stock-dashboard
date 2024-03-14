"use client";

import React from 'react';
import { useRouter } from 'next/navigation';


export default function StockItem({stock}: {stock: string}) {
    const router = useRouter();

    const handleSearch = (stock: string) => {
        router.push(`/stocks/${stock}`);
    };

    return (
        <div className="p-1 m-1 cursor-pointer hover:bg-sky-100 hover:text-blue-600 border rounded-lg" onClick={() => { handleSearch(stock) }}>{stock}</div>
    );
}
