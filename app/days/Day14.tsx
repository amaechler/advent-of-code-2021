import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

interface Rule {
    pattern: string;
    insert: string;
}

interface Insertion {
    position: number;
    molecule: string;
}

function parseInput(input: string[]): { template: string; rules: Rule[] } {
    const template = input[0];

    const rules = input.slice(2).map(l => {
        const match = l.match(/(\w+) -> (\w+)/);
        if (!match) {
            throw new Error("Invalid line");
        }

        const rule: Rule = {
            pattern: match[1] as string,
            insert: match[2] as string
        };

        return rule;
    });

    return { template, rules };
}

const part1 = (template: string, rules: Rule[]) => {
    let polymer = template;

    var rulesLookup = rules.reduce((acc, curr) => {
        acc[curr.pattern] = curr.insert;
        return acc;
    }, {} as { [pattern: string]: string });

    // run steps
    for (let i = 0; i < 40; i++) {
        const insertions: Insertion[] = [];

        // find all insertions
        for (let j = 1; j < polymer.length; j++) {
            const insert = rulesLookup[`${polymer[j - 1]}${polymer[j]}`];
            if (insert) {
                insertions.push({ position: j, molecule: insert });
            }
        }

        // apply insertions
        const polymerArray = polymer.split("");
        for (let j = 0; j < insertions.length; j++) {
            polymerArray.splice(insertions[j].position + j, 0, insertions[j].molecule);
        }
        polymer = polymerArray.join("");
    }

    const moleculeCountMap = polymer.split("").reduce((acc, curr) => {
        acc[curr] = acc[curr] !== undefined ? acc[curr] + 1 : 1;
        return acc;
    }, {} as { [molecule: string]: number });

    const moleculeCounts = Object.values(moleculeCountMap).sort((a, b) => a - b);

    return moleculeCounts[moleculeCounts.length - 1] - moleculeCounts[0];
};

const part2 = (input: string[]) => {
    return "";
};

export const Day14 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const { template, rules } = parseInput(input);

    return (
        <>
            <h2>Part 1</h2>
            <p>{part1(template, rules)}</p>

            <hr />

            <h2>Part 2</h2>
            <p>{part2(input)}</p>
        </>
    );
};
