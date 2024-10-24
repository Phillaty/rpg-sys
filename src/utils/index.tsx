export const getPercentage = (total: number, actual: number) => {

    let result = (actual / total) * 100;

    return result;
}