import { LoaderFunction, useLoaderData } from "remix";
import { Day } from "~/components/Day";
import { DayData, getInputData } from "~/day";
import { lines } from "~/util";

export const loader: LoaderFunction = async ({}) => {
    return getInputData({ day: 2 });
};

interface Command {
    direction: "forward" | "up" | "down";
    distance: number;
}

export default function Day2() {
    const { fileData, name } = useLoaderData<DayData>();

    const createContent = () => {
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
            const finalPosition = commands.reduce(
                (p, c) =>
                    c.direction === "forward"
                        ? { ...p, x: p.x + c.distance }
                        : c.direction === "up"
                        ? { ...p, y: p.y - c.distance }
                        : { ...p, y: p.y + c.distance },
                { x: 0, y: 0 }
            );

            return finalPosition.x * finalPosition.y;
        };

        const part2 = (commands: Command[]) => {
            const finalPosition = commands.reduce(
                (p, c) =>
                    c.direction === "forward"
                        ? {
                              ...p,
                              x: p.x + c.distance,
                              y: p.y + c.distance * p.aim,
                          }
                        : c.direction === "up"
                        ? { ...p, aim: p.aim - c.distance }
                        : { ...p, aim: p.aim + c.distance },
                { x: 0, y: 0, aim: 0 }
            );

            return finalPosition.x * finalPosition.y;
        };

        return (
            <>
                <p>Part 1: {part1(commands)}</p>
                <p>Part 2: {part2(commands)}</p>
            </>
        );
    };

    return <Day content={createContent()} fileData={fileData} name={name} />;
}
