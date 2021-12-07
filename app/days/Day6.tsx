import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

function runFishSimulation({
    fishTimers,
    numberOfDaysToSimulate
}: {
    fishTimers: number[];
    numberOfDaysToSimulate: number;
}): number {
    // count number of fishes by spawn cycles
    const numberOfFishesPerCycle = fishTimers.reduce((acc, curr) => {
        acc[curr]++;
        return acc;
    }, Array(9).fill(0) as number[]);

    for (let day = 0; day < numberOfDaysToSimulate; day++) {
        // advance fish timers
        const eolFishes = numberOfFishesPerCycle.shift() as number;

        // reset the EOL fishes
        numberOfFishesPerCycle[6] += eolFishes;

        // spawn new baby fishes
        numberOfFishesPerCycle[8] = eolFishes;
    }

    return numberOfFishesPerCycle.reduce((acc, curr) => acc + curr, 0);
}

export const Day6 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const fishTimers = input[0].split(",").map(x => Number(x));

    const part1 = () => runFishSimulation({ fishTimers, numberOfDaysToSimulate: 80 });
    const part2 = () => runFishSimulation({ fishTimers, numberOfDaysToSimulate: 256 });

    return (
        <>
            <h2>Part 1</h2>
            <p>Number of fishes: {part1()}</p>

            <hr />

            <h2>Part 2</h2>
            <p>Number of fishes: {part2()}</p>
        </>
    );
};
