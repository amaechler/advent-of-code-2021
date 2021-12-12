import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

const part1 = (input: string[]) => {
    return "";
};

const part2 = (input: string[]) => {
    return "";
};

export const Day20 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);

    return (
        <>
            <h2>Part 1</h2>
            <p>{part1(input)}</p>

            <hr />

            <h2>Part 2</h2>
            <p>{part2(input)}</p>
        </>
    );
};
