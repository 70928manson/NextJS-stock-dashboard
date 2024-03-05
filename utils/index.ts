export const accumulate = (acc: number, curr: number) => {
    if (Number(curr)) {
        return Number(acc) + Number(curr)
    } else {
        return acc + 0
    }
}

// csv 資料手動組成json
export const stringToJsonData = (str: string, headers: string[]) => {
    const lines = `${str}`.split('\n');
    const delimeter = ",";

    const result = [];

    for (const line of lines) {
        const obj: any = {};
        const row = line.split(delimeter);
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            obj[header] = row[i];
        }
        result.push(obj);
    }
    return result
}