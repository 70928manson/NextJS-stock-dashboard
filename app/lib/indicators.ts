//VIX (台指選擇權波動率指數專區)  CORS error
export async function fetchVIX() {
    try {
        const url = "https://mis.taifex.com.tw/futures/api/getQuoteListVIX"

        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
        const data = JSON.stringify({
            AscDesc: "A",
            SortColumn: ""
        });

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: data
        }).catch((err) => {
            console.log("err", err);

        });
        console.log("response", response);
    } catch(err) {
        console.log("err", err);
        
    }
    

//     const data = await response.json();

//     console.log('data', data);
//     return data;
}