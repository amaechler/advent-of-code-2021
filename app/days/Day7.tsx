import { lines, range } from "~/util";
import { SpecificDayProps } from "./shared";

function calculateFuelUsage({
    crabPositions,
    useAdvancedEngineering
}: {
    crabPositions: number[];
    useAdvancedEngineering: boolean;
}) {
    let lowestFuelUsage = { crabPosition: -1, usage: Number.MAX_VALUE };

    for (const positionToAlignOn of range(0, Math.max(...crabPositions), 1)) {
        let currentFuelUsage = 0;
        for (const currentCrabPosition of crabPositions) {
            const distance = Math.abs(currentCrabPosition - positionToAlignOn);

            currentFuelUsage += useAdvancedEngineering ? (distance * (distance + 1)) / 2 : distance;
            if (currentFuelUsage > lowestFuelUsage.usage) {
                break;
            }
        }

        // console.log(`Fuel usage to align on ${positionToAlignOn}: ${currentFuelUsage}`);

        if (currentFuelUsage < lowestFuelUsage.usage) {
            lowestFuelUsage = { crabPosition: positionToAlignOn, usage: currentFuelUsage };
        }
    }

    return lowestFuelUsage;
}

export const Day7 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const crabPositions = input[0].split(",").map(x => Number(x));

    const part1 = calculateFuelUsage({ crabPositions, useAdvancedEngineering: false });
    const part2 = calculateFuelUsage({ crabPositions, useAdvancedEngineering: true });

    return (
        <>
            <h2>Part 1</h2>
            <p>
                Lowest fuel usage using simplified crab engineering is {part1.usage} when aligning on crab position{" "}
                {part1.crabPosition}.
            </p>

            <hr />

            <h2>Part 2</h2>
            <p>
                Lowest fuel usage using advanced crab engineering is {part2.usage} when aligning on crab position{" "}
                {part2.crabPosition}.
            </p>
        </>
    );
};
