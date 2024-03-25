'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx';
import Searchbar from "./Searchbar";

const links = [
    // { name: '首頁', href: '/', icon: "" },
    { name: '經濟指標', href: '/indicators', icon: "" },
    { name: '個股', href: '/stocks', icon: "" },
    { name: 'ETF', href: '/ETF', icon: "" },
    { name: 'ROI', href: '/ROI', icon: "" },
    { name: '追蹤', href: '/portfolios', icon: "" },
    { name: '登入', href: '/signin', icon: "" },
    { name: '註冊', href: '/signup', icon: "" },
];

// TODO: tailwind hamburger for rwd

export default function Navbar() {
    const pathname = usePathname();
    return (
        <div className="flex border-b-2 justify-around items-center sticky w-full top-0 z-50 bg-white mb-2">
            <Link
                key="icon"
                href="/"
                className="px-2"
            >
                {/* <LinkIcon className="w-6" /> */}
                <p className="hidden md:block py-1 font-bold">icon To Home</p>
            </Link>
            <div className="flex items-center">
                <div className="flex h-[80%]">
                    <Searchbar placeholder="請輸入股票代碼" />
                </div>
                {links.map((link) => {
                    // const LinkIcon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'flex grow items-center justify-center gap-2 bg-gray-50 px-5 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-5 md:px-5',
                                {
                                    'bg-sky-100 text-blue-600': pathname === link.href
                                }
                            )}
                        >
                            {/* <LinkIcon className="w-6" /> */}
                            <p className="hidden md:block py-1 font-bold">{link.name}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
