'use client';

import { useParams } from 'next/navigation';

export default async function Page() {
    const params = useParams<{id: string}>();

    return (
        <main>
            <p>Current params id: {params.id}</p>
            個股頁面
            籌碼
            k棒
            基本面
            新聞動態
        </main>
    );
}