import { jsonDeepCopy, lines, range } from "~/util";
import { SpecificDayProps } from "./shared";

interface Element {
    m: number;
    n: number;
}

/**
 * Simulates energy levels of octopuses.
 *
 * If @param numberOfSteps is provided, will run simulation for # times and then return the number of flashes.
 * If @param numberOfSteps is undefined, will run simulation until the first synchronized flash happens (max 1000).
 */
const runFlashSimulation = (
    energyLevels: number[][],
    numberOfSteps: number | undefined
): { numberOfFlashes?: number; firstSynchronizedFlash?: number } => {
    const currentEnergyLevels = jsonDeepCopy(energyLevels);

    let numberOfFlashes = 0;
    let firstSynchronizedFlash: number | undefined = undefined;

    for (const step of range(1, numberOfSteps ?? 1000)) {
        // energy level of each octopus increases by 1
        const initialFlashers: Element[] = [];
        for (let m = 0; m < currentEnergyLevels.length; m++) {
            for (let n = 0; n < currentEnergyLevels[m].length; n++) {
                currentEnergyLevels[m][n]++;
                if (currentEnergyLevels[m][n] === 10) {
                    initialFlashers.push({ m, n });
                }
            }
        }

        // any octopus with an energy level greater than 9 flashes; this increases the energy level of all
        // adjacent octopuses by 1, including octopuses that are diagonally adjacent; if this causes an octopus to
        // have an energy level greater than 9, it also flashes; this process continues as long as new octopuses
        // keep having their energy level increased beyond 9
        const recursivelyFlash = (octopus: Element) => {
            numberOfFlashes++;

            const energizedOctopuses = [
                { m: octopus.m - 1, n: octopus.n - 1 },
                { m: octopus.m - 1, n: octopus.n },
                { m: octopus.m - 1, n: octopus.n + 1 },
                { m: octopus.m, n: octopus.n - 1 },
                { m: octopus.m, n: octopus.n + 1 },
                { m: octopus.m + 1, n: octopus.n - 1 },
                { m: octopus.m + 1, n: octopus.n },
                { m: octopus.m + 1, n: octopus.n + 1 }
            ].filter(x => currentEnergyLevels[x.m]?.[x.n] !== undefined);

            for (const energizedOctopus of energizedOctopuses) {
                currentEnergyLevels[energizedOctopus.m][energizedOctopus.n]++;
                if (currentEnergyLevels[energizedOctopus.m][energizedOctopus.n] === 10) {
                    recursivelyFlash({ m: energizedOctopus.m, n: energizedOctopus.n });
                }
            }
        };

        initialFlashers.forEach(flasher => recursivelyFlash(flasher));

        // any octopus that flashed during this step has its energy level set to 0
        for (let m = 0; m < currentEnergyLevels.length; m++) {
            for (let n = 0; n < currentEnergyLevels[m].length; n++) {
                if (currentEnergyLevels[m][n] > 9) {
                    currentEnergyLevels[m][n] = 0;
                }
            }
        }

        // check for a synchronized flash 💥
        if (firstSynchronizedFlash === undefined) {
            if (currentEnergyLevels.every(l => l.every(e => e === 0))) {
                firstSynchronizedFlash = step;
                if (numberOfSteps === undefined) {
                    break;
                }
            }
        }
    }

    return { numberOfFlashes, firstSynchronizedFlash };
};

const part1 = (energyLevels: number[][]): number | undefined => runFlashSimulation(energyLevels, 100).numberOfFlashes;
const part2 = (energyLevels: number[][]): number | undefined =>
    runFlashSimulation(energyLevels, undefined).firstSynchronizedFlash;

export const Day11 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const energyLevels = input.map(l => l.split("").map(o => Number(o)));

    return (
        <>
            <h2>Part 1</h2>
            <p>Number of flashes: {part1(energyLevels)}</p>

            <hr />

            <h2>Part 2</h2>
            <p>First synchronized flash: {part2(energyLevels)}</p>
        </>
    );
};
