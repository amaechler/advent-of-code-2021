import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

export const Day4 = ({ day, fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const report = lines(fileData);

    const part1 = () => {};

    const part2 = () => {};

    return (
        <>
            <h2>Part 1</h2>
            <p></p>

            <hr />

            <h2>Part 2</h2>
            <p></p>
        </>
    );
};
