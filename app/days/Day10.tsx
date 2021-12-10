import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

const pairMap: any = { "{": "}", "[": "]", "(": ")", "<": ">" };

const findCorruptedLines = (input: string[]) =>
    input.reduce((acc, curr) => {
        const stack: string[] = [];
        for (const char of curr.split("")) {
            if (char === "{" || char === "[" || char === "<" || char === "(") {
                stack.push(char);
            } else {
                const lastElement = stack.pop();
                if (lastElement === undefined || char !== pairMap[lastElement]) {
                    acc.push({ firstCorruptedCharacter: char, corruptedLine: curr });
                    break;
                }
            }
        }

        return acc;
    }, [] as { firstCorruptedCharacter: string; corruptedLine: string }[]);

const part1 = (input: string[]) => {
    const syntaxErrorScore: { [k: string]: number } = {
        ")": 3,
        "]": 57,
        "}": 1197,
        ">": 25137
    };

    return findCorruptedLines(input).reduce((acc, curr) => acc + syntaxErrorScore[curr.firstCorruptedCharacter], 0);
};

const part2 = (input: string[]) => {
    const corrupted = findCorruptedLines(input);
    const incompleteLines = input.filter(i => !corrupted.map(c => c.corruptedLine).includes(i));

    const closingSequences = incompleteLines.reduce((acc, curr) => {
        const stack: string[] = [];
        for (const char of curr.split("")) {
            if (char === "{" || char === "[" || char === "<" || char === "(") {
                stack.push(char);
            } else {
                stack.pop();
            }
        }

        const closingSequence: string[] = stack.reverse().map(c => pairMap[c]);
        acc.push(closingSequence);

        return acc;
    }, [] as string[][]);

    const autocompleteScore: { [k: string]: number } = {
        ")": 1,
        "]": 2,
        "}": 3,
        ">": 4
    };

    const scores = closingSequences.reduce((acc, curr) => {
        acc.push(curr.reduce((a, b) => 5 * a + autocompleteScore[b], 0));
        return acc;
    }, [] as number[]);

    const middleScore = scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
    return middleScore;
};

export const Day10 = ({ fileData }: SpecificDayProps) => {
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
