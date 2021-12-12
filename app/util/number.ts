/**
 * Returns a number array from start (inclusive) to stop (inclusive) using an optional step.
 */
export function range(start: number, stop: number, step = 1): number[] {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
}
