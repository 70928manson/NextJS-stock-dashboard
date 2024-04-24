// 爬蟲開抓
import { JSDOM } from 'jsdom';

export async function getDownloads(etf: string = '0050') {
    const res = await fetch(`https://matchbox.space/etf?stock=${etf}.TW`, {
        cache: 'no-store',
    })

    
    const html = await res.text();
    
    const dom = new JSDOM(html); 

    const document = dom.window.document;
    
    // 前十大持股 名稱
    const tableBody = document.querySelectorAll(".v-progress-linear__content div div");
    const aaa = document.querySelectorAll(".v-avatar.v-list-item__avatar span .v-chip__content");

    const arr = [];

    const length = tableBody.length;

    for (let i=0; i < length; i++) {
        arr.push({
            name: tableBody[i].textContent,
            percent: aaa[i].textContent
        })
    }

    // // return tableBody
     return arr
}