import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

const getBitCounts = (report: string[]) => {
    const bitCounts = [...Array(report[0].length)].map(() => Array(2).fill(0));

    for (const line of report) {
        for (let p = 0; p < line.length; p++) {
            if (line[p] === "0") bitCounts[p][0]++;
            else bitCounts[p][1]++;
        }
    }

    return bitCounts;
};

export const Day3 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const report = lines(fileData);
    const bitCounts = getBitCounts(report);

    const part1 = () => {
        const gammaRate = Number(`0b${bitCounts.reduce((p, c) => p + (Number(c[0]) > Number(c[1]) ? "0" : "1"), "")}`);

        const epsilonRate = Number(
            `0b${bitCounts.reduce((p, c) => p + (Number(c[0]) > Number(c[1]) ? "1" : "0"), "")}`
        );

        return { gammaRate, epsilonRate };
    };

    const part2 = () => {
        let filteredNumbers = [...report];
        for (let i = 0; i < report[0].length; i++) {
            const b = getBitCounts(filteredNumbers);
            filteredNumbers = filteredNumbers.filter(x => x[i] === (Number(b[i][0]) > Number(b[i][1]) ? "0" : "1"));

            if (filteredNumbers.length === 1) {
                break;
            }
        }

        const oxygenGeneratorRating = Number(`0b${filteredNumbers[0]}`);

        filteredNumbers = [...report];
        for (let i = 0; i < report[0].length; i++) {
            const b = getBitCounts(filteredNumbers);
            filteredNumbers = filteredNumbers.filter(x => x[i] === (Number(b[i][0]) > Number(b[i][1]) ? "1" : "0"));

            if (filteredNumbers.length === 1) {
                break;
            }
        }

        const co2ScrubberRating = Number(`0b${filteredNumbers[0]}`);

        return { oxygenGeneratorRating, co2ScrubberRating };
    };

    const { gammaRate, epsilonRate } = part1();
    const { oxygenGeneratorRating, co2ScrubberRating } = part2();

    return (
        <>
            <h2>Part 1</h2>
            <p>Power Consumption: {gammaRate * epsilonRate}</p>

            <hr />

            <h2>Part 2</h2>
            <p>Life Support Rating: {oxygenGeneratorRating * co2ScrubberRating}</p>
        </>
    );
};
