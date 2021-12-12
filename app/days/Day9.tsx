import { jsonDeepCopy, lines, sortBy } from "~/util";
import { Day9Visualization } from "./Day9Visualization";
import { SpecificDayProps } from "./shared";

interface LowPoint {
    m: number;
    n: number;
}

const findLowPoints = (heightMatrix: number[][]): LowPoint[] => {
    const lowPoints: LowPoint[] = [];

    for (let i = 0; i < heightMatrix.length; i++) {
        for (let j = 0; j < heightMatrix[0].length; j++) {
            const neighbours = [
                heightMatrix[i - 1]?.[j],
                heightMatrix[i + 1]?.[j],
                heightMatrix[i][j - 1],
                heightMatrix[i][j + 1]
            ].filter(x => x !== undefined);

            if (neighbours.every(n => n > heightMatrix[i][j])) {
                lowPoints.push({ m: i, n: j });
            }
        }
    }

    return lowPoints;
};

const part1 = (heightMatrix: number[][]) => {
    return findLowPoints(heightMatrix).reduce((acc, curr) => acc + heightMatrix[curr.m][curr.n] + 1, 0);
};

const part2 = (heightMatrix: number[][]) => {
    const lowPoints = findLowPoints(heightMatrix);

    const basins = lowPoints.map(l => [l]);
    for (const basin of basins) {
        const findBasinCandidates = (lowPoint: LowPoint) => {
            const validBasinNeighbours: LowPoint[] = [
                { m: lowPoint.m - 1, n: lowPoint.n },
                { m: lowPoint.m + 1, n: lowPoint.n },
                { m: lowPoint.m, n: lowPoint.n - 1 },
                { m: lowPoint.m, n: lowPoint.n + 1 }
            ].filter(
                x =>
                    heightMatrix[x.m]?.[x.n] !== undefined &&
                    heightMatrix[x.m][x.n] !== undefined &&
                    heightMatrix[x.m][x.n] !== 9 && // high point
                    heightMatrix[x.m][x.n] !== -1 // previously visited
            );

            // add valid basin neighbours to current basin if they haven't already been detected
            for (const validNeighbour of validBasinNeighbours) {
                if (!basin.find(l => l.m === validNeighbour.m && l.n === validNeighbour.n)) {
                    basin.push(validNeighbour);
                }
            }

            // mark low point as visited
            heightMatrix[lowPoint.m][lowPoint.n] = -1;

            // lookup more candidates recursively
            for (const neighbour of validBasinNeighbours) {
                findBasinCandidates(neighbour);
            }
        };

        findBasinCandidates(basin[0]);
    }

    return sortBy(basins, "length")
        .slice(-3)
        .reduce((acc, curr) => acc * curr.length, 1);
};

export const Day9 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const heightMatrix = lines(fileData).map(l => l.split("").map(n => Number(n)));
    const mutatedMatrix: number[][] = jsonDeepCopy(heightMatrix);

    return (
        <>
            <h2>Part 1</h2>
            <p>
                Map Size: {mutatedMatrix.length}x{mutatedMatrix[0].length}, Number of low points: {part1(mutatedMatrix)}
            </p>

            <hr />

            <h2>Part 2</h2>
            <p>{part2(mutatedMatrix)}</p>

            <hr />

            <Day9Visualization matrix={heightMatrix} />
        </>
    );
};
