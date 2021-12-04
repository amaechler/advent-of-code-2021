import { LineChart } from "~/components";
import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

interface Command {
    direction: "forward" | "up" | "down";
    distance: number;
}

export const Day2 = ({ day, fileData }: SpecificDayProps) => {
    if (!fileData) {
        return null;
    }

    const commands = lines(fileData).map((l: string) => {
        const match = l.match(/(forward|up|down) ([0-9]+)/);
        if (!match) {
            throw new Error("Invalid line");
        }

        const command: Command = {
            direction: match[1] as any,
            distance: Number(match[2]),
        };

        return command;
    });

    const part1 = (commands: Command[]) => {
        const positions = commands.reduce(
            (p, c) => {
                const previousPosition = p[p.length - 1];

                const newPosition =
                    c.direction === "forward"
                        ? {
                              ...previousPosition,
                              x: previousPosition.x + c.distance,
                          }
                        : c.direction === "up"
                        ? {
                              ...previousPosition,
                              y: previousPosition.y - c.distance,
                          }
                        : {
                              ...previousPosition,
                              y: previousPosition.y + c.distance,
                          };

                return [...p, newPosition];
            },
            [{ x: 0, y: 0 }]
        );

        return positions;
    };

    const part2 = (commands: Command[]) => {
        const positions = commands.reduce(
            (p, c) => {
                const previousPosition = p[p.length - 1];

                const newPosition =
                    c.direction === "forward"
                        ? {
                              ...previousPosition,
                              x: previousPosition.x + c.distance,
                              y:
                                  previousPosition.y +
                                  c.distance * previousPosition.aim,
                          }
                        : c.direction === "up"
                        ? {
                              ...previousPosition,
                              aim: previousPosition.aim - c.distance,
                          }
                        : {
                              ...previousPosition,
                              aim: previousPosition.aim + c.distance,
                          };

                return [...p, newPosition];
            },
            [{ x: 0, y: 0, aim: 0 }]
        );

        return positions;
    };

    const part1Positions = part1(commands);
    const part1Sum =
        part1Positions[part1Positions.length - 1].x *
        part1Positions[part1Positions.length - 1].y;

    const part2Positions = part2(commands);
    const part2Sum =
        part2Positions[part2Positions.length - 1].x *
        part2Positions[part2Positions.length - 1].y;

    const chartDimensions = {
        width: 600,
        height: 300,
        margin: {
            top: 30,
            right: 30,
            bottom: 30,
            left: 60,
        },
    };

    return (
        <>
            <h2>Part 1</h2>
            <p>Sum: {part1Sum}</p>
            <LineChart
                items={part1Positions.filter((_, i) => i % 20 == 0)}
                dimensions={chartDimensions}
            />

            <hr />

            <h2>Part 2</h2>
            <p>Sum: {part2Sum}</p>
            <LineChart
                items={part2Positions.filter((_, i) => i % 20 == 0)}
                dimensions={chartDimensions}
            />
        </>
    );
};
