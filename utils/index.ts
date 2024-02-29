export const accumulate = (acc: number, curr: number) => {
    if (Number(curr)) {
        return Number(acc) + Number(curr)
    } else {
        return acc + 0
    }
}