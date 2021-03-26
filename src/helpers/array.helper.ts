/**
 * Function that gets a random subset of length n from an array of objects.
 *
 * @param arr     The array of objects.
 * @param n       The number of objects to be returned.
 * @return [any]  Array of length n.
 */
export function getRandom(arr: [any], n: number): any {
    let result: any[] = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("array.helper.getRandom: more elements taken than available.");
    while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
