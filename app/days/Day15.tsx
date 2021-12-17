import { lines, moduloWithOffset } from "~/util";
import { SpecificDayProps } from "./shared";
const astar = require("javascript-astar");

function parseInput(input: string[]): number[][] {
    return input.map(l => l.split("").map(n => Number(n)));
}

/**
 * Calculates the shortest path using A* (thanks @101100 😊).
 */
function calculateLowestTotalRisk(riskLevels: number[][]) {
    var graph = new astar.Graph(riskLevels);

    var start = graph.grid[0][0];
    var end = graph.grid[riskLevels.length - 1][riskLevels[0].length - 1];

    var result = astar.astar.search(graph, start, end);

    const lowestTotalRisk = result.reduce((acc: number, curr: any) => acc + curr.weight, 0);

    return lowestTotalRisk;
}

const part1 = (riskLevels: number[][]) => {
    const lowestTotalRisk = calculateLowestTotalRisk(riskLevels);
    console.log(lowestTotalRisk);

    return lowestTotalRisk;
};

const part2 = (riskLevels: number[][]) => {
    // create real grid (which is also square)
    const completeRiskLevels: number[][] = [...Array(riskLevels.length * 5)].map(() =>
        Array(riskLevels.length * 5).fill(0)
    );

    for (let m = 0; m < 5 * riskLevels.length; m++) {
        for (let n = 0; n < 5 * riskLevels.length; n++) {
            const step = Math.floor(m / riskLevels.length) + Math.floor(n / riskLevels.length);

            completeRiskLevels[m][n] = moduloWithOffset(
                riskLevels[m % riskLevels.length][n % riskLevels.length] + step,
                9,
                1
            );
        }
    }

    for (let m = 0; m < 5 * riskLevels.length; m++) {}

    const lowestTotalRisk = calculateLowestTotalRisk(completeRiskLevels);
    console.log(lowestTotalRisk);

    return lowestTotalRisk;
};

export const Day15 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const riskLevels = parseInput(input);

    return (
        <>
            <h2>Part 1</h2>
            {/* <p>{part1(riskLevels)}</p> */}

            <hr />

            <h2>Part 2</h2>
            <p>{part2(riskLevels)}</p>
        </>
    );
};
