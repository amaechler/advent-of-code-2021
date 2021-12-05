import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

interface Line {
    start: Point;
    end: Point;
}

interface Point {
    x: number;
    y: number;
}

function parseInput(input: string[]): Line[] {
    const vents = input.map(l => {
        const match = l.match(/(\d+),(\d+) -> (\d+),(\d+)/);
        if (!match) {
            throw new Error("Invalid line");
        }

        const vent: Line = {
            start: { x: Number(match[1] as string), y: Number(match[2] as string) },
            end: { x: Number(match[3] as string), y: Number(match[4] as string) }
        };

        return vent;
    });

    return vents;
}

function calculateOverlappingPoints(vents: Line[], skipDiagonal = false): number {
    const gridSize = {
        x: Math.max(...[...vents.map(v => v.start.x), ...vents.map(v => v.end.x)]),
        y: Math.max(...[...vents.map(v => v.start.y), ...vents.map(v => v.end.y)])
    };

    const grid = [...Array(gridSize.y + 1)].map(() => Array(gridSize.x + 1).fill(0));

    for (const v of vents) {
        const minX = Math.min(v.start.x, v.end.x);
        const minY = Math.min(v.start.y, v.end.y);
        const maxX = Math.max(v.start.x, v.end.x);
        const maxY = Math.max(v.start.y, v.end.y);

        if (v.start.x === v.end.x) {
            for (let i = minY; i <= maxY; i++) {
                grid[v.start.x][i]++;
            }
        } else if (v.start.y === v.end.y) {
            for (let i = minX; i <= maxX; i++) {
                grid[i][v.start.y]++;
            }
        } else {
            if (skipDiagonal) {
                // console.log("Skipping line", v);
                continue;
            }

            for (let i = 0; i <= maxX - minX; i++) {
                const x = v.start.x + i * (minX === v.start.x ? 1 : -1);
                const y = v.start.y + i * (minY === v.start.y ? 1 : -1);
                // console.log(`Incrementing (${x},${y})`);
                grid[x][y]++;
            }
        }
    }

    return grid.flat().filter(i => i > 1).length;
}

export const Day5 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const vents = parseInput(input);

    const part1 = () => calculateOverlappingPoints(vents, true);
    const part2 = () => calculateOverlappingPoints(vents, false);

    return (
        <>
            <h2>Part 1</h2>
            <p>Overlapping Points: {part1()}</p>

            <hr />

            <h2>Part 2</h2>
            <p>Overlapping Points: {part2()}</p>
        </>
    );
};
