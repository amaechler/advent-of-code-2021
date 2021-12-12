import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

interface Entry {
    signalPatterns: string[];
    outputValue: string[];
}

const parseInput = (lines: string[]) =>
    lines.map(l => {
        const matches = l.matchAll(/([a-g]+)/g);
        if (!matches) {
            throw new Error("Invalid line");
        }

        const matchedValues = [...matches].map(m => m[0]);

        return {
            signalPatterns: matchedValues.slice(0, 10),
            outputValue: matchedValues.slice(10, 14)
        } as Entry;
    });

const part1 = (entries: Entry[]) => {
    return entries.reduce(
        (acc, curr) =>
            curr.outputValue.reduce(
                (a, c) =>
                    (c.length === 2 || // "1"
                    c.length === 4 || // "4"
                    c.length === 3 || // "7"
                    c.length === 7 // "8"
                        ? 1
                        : 0) + a,
                0
            ) + acc,
        0
    );
};

const part2 = (entries: Entry[]) => {
    return entries.reduce((acc, curr) => {
        // "1"
        const number1 = curr.signalPatterns.find(p => p.length === 2);
        if (!number1) {
            throw new Error("Number 1 not detected");
        }

        // "4"
        const number4 = curr.signalPatterns.find(p => p.length === 4);
        if (!number4) {
            throw new Error("Number 4 not detected");
        }

        // "7"
        const number7 = curr.signalPatterns.find(p => p.length === 3);
        if (!number7) {
            throw new Error("Number 7 not detected");
        }

        // "8"
        const number8 = curr.signalPatterns.find(p => p.length === 7);
        if (!number8) {
            throw new Error("Number 8 not detected");
        }

        // "5" (l: 5) and "3" (l: 5)
        // if we combine 4 + 7, number 5 and number contain all those values plus one more unique value;
        // however number 3 also contains the values from number 1, and 5 does not
        const chars47 = [...new Set((number4 + number7).split(""))];
        const number3Or5 = curr.signalPatterns.filter(
            p => p.length === 5 && p.split("").filter(x => !chars47.includes(x)).length === 1 // contains one extra char
        );
        const number3 = number3Or5.find(x => number1.split("").every(y => x.includes(y)));
        if (!number3) {
            throw new Error("Number 3 not detected");
        }

        const number5 = number3Or5.find(x => x !== number3);
        if (!number5) {
            throw new Error("Number 5 not detected");
        }

        // "2" (l: 5), now the only unmapped digit with length 5
        const number2 = curr.signalPatterns.find(p => p.length === 5 && !number3Or5.includes(p));
        if (!number2) {
            throw new Error("Number 2 not detected");
        }

        // "9" (l: 6), the chars of 3 + 4 combined
        const chars34 = [...new Set((number3 + number4).split(""))];
        const number9 = curr.signalPatterns.find(p => p.length === 6 && p.split("").every(x => chars34.includes(x)));
        if (!number9) {
            throw new Error("Number 9 not detected");
        }

        // "6" (l: 6), 6 - 5 leaves one and is not 9
        const number6 = curr.signalPatterns.find(
            p => p.length === 6 && p !== number9 && p.split("").filter(x => !number5.includes(x)).length === 1
        );
        if (!number6) {
            throw new Error("Number 6 not detected");
        }

        // "0" (l: 6), the last remaining one
        const number0 = curr.signalPatterns.find(
            p =>
                p !== number1 &&
                p !== number2 &&
                p !== number3 &&
                p !== number4 &&
                p !== number5 &&
                p !== number6 &&
                p !== number7 &&
                p !== number8 &&
                p !== number9
        );
        if (!number0) {
            throw new Error("Number 0 not detected");
        }

        const map: { [key: string]: string } = {
            [number0]: "0",
            [number1]: "1",
            [number2]: "2",
            [number3]: "3",
            [number4]: "4",
            [number5]: "5",
            [number6]: "6",
            [number7]: "7",
            [number8]: "8",
            [number9]: "9"
        };

        // TODO this is very silly; instead of now generating permutations, figure out which digit lights up
        // which segment and use that to create the number

        // return the numeric value of the outputValue
        return (
            acc +
            Number(
                curr.outputValue.reduce((a, c) => {
                    const x = a + map[[...permut(c)].find(x => map[x] !== undefined) as any];
                    return x;
                }, "")
            )
        );
        // return 0;
    }, 0);
};

function permut(inputString: string): string[] | string {
    if (inputString.length < 2) return inputString; // This is our break condition

    const permutations = []; // This array will hold our permutations
    for (let i = 0; i < inputString.length; i++) {
        const char = inputString[i];

        // Cause we don't want any duplicates:
        if (inputString.indexOf(char) != i)
            // if char was used already
            continue; // skip it this time

        const remainingString = inputString.slice(0, i) + inputString.slice(i + 1, inputString.length); //Note: you can concat Strings via '+' in JS

        for (const subPermutation of permut(remainingString)) {
            permutations.push(char + subPermutation);
        }
    }

    return permutations;
}

export const Day8 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const entries = parseInput(input);

    return (
        <>
            <h2>Part 1</h2>
            <p>Digits 1, 4, 7, or 8 appear {part1(entries)} times in the output values.</p>

            <hr />

            <h2>Part 2</h2>
            <p>{part2(entries)}</p>
        </>
    );
};
