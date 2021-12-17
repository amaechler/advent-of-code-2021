/**
 * Returns module between [offset..offset + modulo - 1].
 *
 * https://en.wikipedia.org/wiki/Modulo_operation#Modulo_with_offset
 */
export function moduloWithOffset(a: number, m: number, offset: number) {
    return a - m * Math.floor((a - offset) / m);
}
