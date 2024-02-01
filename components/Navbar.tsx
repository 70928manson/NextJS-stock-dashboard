'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx';

const links = [
    { name: 'Home', href: '/', icon: "" },
    { name: 'Indicators', href: '/indicators', icon: "" },
    { name: 'Portfolios', href: '/portfolios', icon: "" },
    { name: 'ETF', href: '/ETF', icon: "" },
    { name: 'Stocks', href: '/stocks', icon: "" },
    { name: 'ROI', href: '/ROI', icon: "" },
    { name: 'Signin', href: '/signin', icon: "" },
    { name: 'Signup', href: '/signup', icon: "" },
]

export default function Navbar() {
    const pathname = usePathname();
    return (
        // <div>
        //     Icon, 搜尋, 首頁, 指標, 追蹤列表, ETF觀測站, 個股, 報酬率, 登入/註冊
        // </div>
        <div className="flex max-w-[1340px] mx-auto justify-between">
            <div>
                icon
            </div>
            <div className="flex">
                <div>
                    search bar
                </div>
                <div className="flex">
                    {links.map((link) => {
                        // const LinkIcon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    'flex h-[48px] grow items-center justify-center gap-2 bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                                    {
                                        'bg-sky-100 text-blue-600': pathname === link.href
                                    }
                                )}
                            >
                                {/* <LinkIcon className="w-6" /> */}
                                <p className="hidden md:block">{link.name}</p>
                            </Link>
                        );
                    })}

                </div>
            </div>
        </div>
    );
}
