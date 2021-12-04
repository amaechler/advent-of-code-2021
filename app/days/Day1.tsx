import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

export const Day1 = ({ fileData }: SpecificDayProps) => {
    if (!fileData) {
        return null;
    }

    const numbers = lines(fileData).map((l: string) => Number(l));

    const part1 = (numbers: number[]) => {
        let numberOfIncreases = 0;
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] > numbers[i - 1]) {
                numberOfIncreases++;
            }
        }

        return numberOfIncreases;
    };

    const part2 = (numbers: number[]) => {
        const windowSize = 3;

        let numberOfIncreases = 0;
        let previousWindowSum: number | undefined = undefined;
        for (let i = windowSize - 1; i < numbers.length; i++) {
            const currentWindowSum = numbers
                .slice(i - windowSize + 1, i + 1)
                .reduce((a: number, b: number) => a + b, 0);

            if (previousWindowSum && currentWindowSum > previousWindowSum) {
                numberOfIncreases++;
            }

            previousWindowSum = currentWindowSum;
        }

        return numberOfIncreases;
    };

    return (
        <>
            <p>Part 1: {part1(numbers)}</p>
            <p>Part 2: {part2(numbers)}</p>
        </>
    );
};
