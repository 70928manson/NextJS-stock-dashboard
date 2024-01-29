'use client';

import { usePathname } from "next/navigation";

const links = [
    {
        name: "", href: "", icon: "",
    },
    {
        name: "", href: "", icon: "",
    },
    {
        name: "", href: "", icon: "",
    },
    {
        name: "", href: "", icon: "",
    },
    {
        name: "", href: "", icon: "",
    },
]

export default function Navbar() {
    const pathname = usePathname();
    return (
        <div>
            Icon, 搜尋, 指標, 追蹤列表, ETF觀測站, 個股, 報酬率
        </div>
    );
}
