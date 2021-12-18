import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

interface Point {
    x: number;
    y: number;
}

type Velocity = Point;

interface TargetArea {
    topLeft: Point;
    bottomRight: Point;
}

function parseInput(input: string[]): TargetArea {
    const match = input[0].match(/target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/);
    if (!match) {
        throw new Error("Invalid line");
    }

    const matches = [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];

    return {
        topLeft: { x: Math.min(matches[0], matches[1]), y: Math.max(matches[2], matches[3]) },
        bottomRight: { x: Math.max(matches[0], matches[1]), y: Math.min(matches[2], matches[3]) }
    };
}

function runSimulation(targetArea: TargetArea): { velocity: Velocity; height: number }[] {
    const hits: { velocity: Velocity; height: number }[] = [];

    // run simulation
    for (let x = 1; x <= targetArea.bottomRight.x; x++) {
        for (let y = -Math.abs(2 * targetArea.bottomRight.y); y < Math.abs(targetArea.bottomRight.y); y++) {
            const velocity: Velocity = { x: x, y: y };

            if (velocity.x === 0 && velocity.y === 0) {
                continue;
            }

            const currentProbePosition: Point = { x: 0, y: 0 };
            let highestY = currentProbePosition.y;
            for (;;) {
                // update position
                currentProbePosition.x += velocity.x;
                currentProbePosition.y += velocity.y;

                // update velocity
                velocity.x = velocity.x > 0 ? velocity.x - 1 : velocity.x < 0 ? velocity.x + 1 : velocity.x;
                velocity.y = velocity.y - 1;

                // are we higher than before?
                if (currentProbePosition.y > highestY) {
                    highestY = currentProbePosition.y;
                }

                const insideTargetArea =
                    currentProbePosition.x >= targetArea.topLeft.x &&
                    currentProbePosition.x <= targetArea.bottomRight.x &&
                    currentProbePosition.y <= targetArea.topLeft.y &&
                    currentProbePosition.y >= targetArea.bottomRight.y;

                const pastTargetArea =
                    currentProbePosition.x >= targetArea.bottomRight.x ||
                    currentProbePosition.y <= targetArea.bottomRight.y;

                // detect whether we are done (inside or past target area)
                if (insideTargetArea || pastTargetArea) {
                    if (insideTargetArea) {
                        hits.push({
                            velocity: { x: x, y: y },
                            height: highestY
                        });
                    }

                    break;
                }
            }
        }
    }

    return hits;
}

const part1 = (targetArea: TargetArea) => {
    const hits = runSimulation(targetArea);

    const highestHit = hits.reduce((acc, curr) => (curr.height > acc.height ? curr : acc), {
        height: 0,
        velocity: { x: 0, y: 0 }
    });

    return highestHit.height;
};

const part2 = (targetArea: TargetArea) => {
    const hits = runSimulation(targetArea);

    return hits.length;
};

export const Day17 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const targetArea = parseInput(input);

    return (
        <>
            <h2>Part 1</h2>
            <p>Highest height reached: {part1(targetArea)}</p>

            <hr />

            <h2>Part 2</h2>
            <p>Number of launches in target area: {part2(targetArea)}</p>
        </>
    );
};
