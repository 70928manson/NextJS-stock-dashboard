"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Searchbar from "./Searchbar";
import { useState } from "react";

const links = [
    // { name: "首頁", href: "/", icon: "" },
    { name: "經濟指標", href: "/indicators", icon: "" },
    { name: "個股", href: "/stocks", icon: "" },
    { name: "ETF", href: "/ETF", icon: "" },
    // { name: "ROI", href: "/ROI", icon: "" },
    // { name: "追蹤", href: "/portfolios", icon: "" },
    // { name: "登入", href: "/signin", icon: "" },
    // { name: "註冊", href: "/signup", icon: "" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const pathname = usePathname();

    return (
        <div className="shadow-md w-full sticky top-0 left-0 mb-2">
            <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
                <div className="font-bold text-2xl cursor-pointer flex items-center text-gray-800">
                    <span className="text-2xl lg:text-3xl text-indigo-600 mr-1 pt-2">
                        Financial corner
                    </span>
                    {/* Designer */}
                </div>

                <div onClick={() => setOpen(!open)} className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden">
                    {/* <ion-icon name={open ? "close" : "menu"}></ion-icon> */}
                    {
                        open ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                    }
                </div>

                <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? "top-20 " : "top-[-490px]"}`}>
                    <div className="w-[33%] lg:w-[40%]">
                        <Searchbar placeholder="請輸入股票代碼" />
                    </div>
                    {links.map((link) => {
                        // const LinkIcon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    "md:ml-8 text-base lg:text-xl md:my-0 my-7 hover:text-indigo-400",
                                    {
                                        "text-indigo-500 border-b-2 border-indigo-600": pathname === link.href
                                    },
                                    {
                                        "text-black md:text-white bg-black md:border md:rounded": link.name === "註冊"
                                    }
                                )}
                            >
                                {/* <LinkIcon className="w-6" /> */}
                                <p className="font-bold">{link.name}</p>
                            </Link>
                        );
                    })}
                    <button className="bg-indigo-600 text-white font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-indigo-400 duration-500">
                        登入 / 註冊
                    </button>
                </ul>
            </div>
        </div>
    );
}
