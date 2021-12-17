import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

interface Rules {
    [pattern: string]: string;
}

interface Insertion {
    position: number;
    molecule: string;
}

function parseInput(input: string[]): { template: string; rules: Rules } {
    const template = input[0];

    const rules = input
        .slice(2)
        .map(l => {
            const match = l.match(/(\w+) -> (\w+)/);
            if (!match) {
                throw new Error("Invalid line");
            }

            return {
                pattern: match[1] as string,
                insert: match[2] as string
            };
        })
        .reduce((acc, curr) => {
            acc[curr.pattern] = curr.insert;
            return acc;
        }, {} as { [pattern: string]: string });

    return { template, rules };
}

const part1 = (template: string, rules: Rules) => {
    let polymer = template.split("");

    // run steps
    for (let i = 0; i < 10; i++) {
        const insertions: Insertion[] = [];

        // find all insertions
        for (let j = 1; j < polymer.length; j++) {
            const insert = rules[`${polymer[j - 1]}${polymer[j]}`];
            if (insert) {
                insertions.push({ position: j, molecule: insert });
            }
        }

        // apply insertions
        for (let j = 0; j < insertions.length; j++) {
            polymer.splice(insertions[j].position + j, 0, insertions[j].molecule);
        }
    }

    const moleculeCountMap = polymer.reduce((acc, curr) => {
        acc[curr] = acc[curr] !== undefined ? acc[curr] + 1 : 1;
        return acc;
    }, {} as { [molecule: string]: number });

    const moleculeCounts = Object.values(moleculeCountMap).sort((a, b) => a - b);

    return moleculeCounts[moleculeCounts.length - 1] - moleculeCounts[0];
};

/**
 * Keep track of the pairs and # of occurrences instead of the massive string.
 *
 * Each step polymerization will just add to the pair count.
 */
const part2 = (template: string, rules: Rules) => {
    let pairMap: { [pair: string]: number } = {};
    for (let j = 1; j < template.length; j++) {
        const key = `${template[j - 1]}${template[j]}`;
        pairMap[key] = pairMap[key] ? pairMap[key] + 1 : 1;
    }

    // run steps
    for (let i = 0; i < 40; i++) {
        const newPairMap = { ...pairMap };

        for (const pair in pairMap) {
            const currentCount = pairMap[pair];
            if (currentCount === 0) {
                continue;
            }

            const insert = rules[pair];
            if (!insert) {
                continue;
            }

            const newPairs = [`${pair[0]}${insert}`, `${insert}${pair[1]}`];
            newPairs.forEach(n => {
                newPairMap[n] = newPairMap[n] ? newPairMap[n] + currentCount : currentCount;
            });
            newPairMap[pair] -= currentCount;
        }

        pairMap = newPairMap;
    }

    // count the first character of the template and then every second character of every pair
    const moleculeCountMap: { [character: string]: number } = {};
    moleculeCountMap[template[0]] = 1;
    Object.entries(pairMap).forEach(([pair, count]) => {
        moleculeCountMap[pair[1]] = moleculeCountMap[pair[1]] ? moleculeCountMap[pair[1]] + count : count;
    });

    const moleculeCounts = Object.values(moleculeCountMap).sort((a, b) => a - b);

    return moleculeCounts[moleculeCounts.length - 1] - moleculeCounts[0];
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
            <p>{part2(template, rules)}</p>
        </>
    );
};
