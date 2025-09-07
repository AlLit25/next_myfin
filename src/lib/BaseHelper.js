export function getTotalSum(data) {
    let result = 0;

    data.map((item) => {
        result += item.sum;
    });

    return result;
}