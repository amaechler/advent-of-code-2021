import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

class Node<T> {
    constructor(public value: T) {}

    addChild(node: Node<T>): void {
        node.parent = this;
        this.children.push(node);
    }

    parent: Node<T> | undefined;
    children: Node<T>[] = [];
}

function parseInput(input: string[]): Node<number | null>[] {
    const buildNode = (snailFishPart: string): Node<number | null> => {
        if (snailFishPart.length === 1) {
            return new Node(Number(snailFishPart));
        }

        if (snailFishPart[0] !== "[" && snailFishPart[snailFishPart.length - 1] !== "]") {
            throw new Error(`Something is up ${snailFishPart[0]}`);
        }

        const snailWithoutOuter = snailFishPart.slice(1, snailFishPart.length - 1);
        let i = 1;
        if (snailWithoutOuter[0] === "[") {
            let bracketCount = 1;
            while (bracketCount > 0) {
                {
                    if (snailWithoutOuter[i] === "[") {
                        bracketCount++;
                    } else if (snailWithoutOuter[i] === "]") {
                        bracketCount--;
                    }

                    i++;
                }
            }
        }

        const node = new Node<number | null>(null);
        node.addChild(buildNode(snailWithoutOuter.slice(0, i)));
        node.addChild(buildNode(snailWithoutOuter.slice(i + 1, snailWithoutOuter.length)));

        return node;
    };

    return input.map(l => buildNode(l));
}

function buildValueNodeOrderMap<T>(node: Node<T>): Map<number, Node<T>> {
    const valueNodeOrderMap = new Map<number, Node<T>>();
    let counter = 0;
    const nodeOrder = (node: Node<T>): void => {
        if (node.value !== null) {
            valueNodeOrderMap.set(counter++, node);
            return;
        }

        for (const child of node.children) {
            nodeOrder(child);
        }
    };
    nodeOrder(node);

    return valueNodeOrderMap;
}

function calculateMagnitude(node: Node<number | null>): number {
    return node.children.length === 0 && node.value !== null
        ? node.value
        : node.children.length === 2 &&
          node.children.every(c => c.children.length === 0) &&
          node.children[0].value !== null &&
          node.children[1].value !== null
        ? node.children[0].value * 3 + node.children[1].value * 2
        : calculateMagnitude(node.children[0]) * 3 + calculateMagnitude(node.children[1]) * 2;
}

function createNodeString(node: Node<number | null> | undefined): string {
    if (node === undefined) {
        return "";
    }

    return node.value !== null
        ? node.value.toString()
        : `[${createNodeString(node.children[0])},${createNodeString(node.children[1])}]`;
}

function traversePairsFromLeftToRight<T>(node: Node<T>): Node<T>[] {
    return node.children.length === 0
        ? []
        : node.children.length === 2 && node.children.every(c => c.children.length === 0)
        ? [node]
        : [traversePairsFromLeftToRight(node.children[0]), traversePairsFromLeftToRight(node.children[1])].flat();
}

function reduce(node: Node<number | null>): Node<number | null> {
    const valueNodeOrderMap = buildValueNodeOrderMap(node);
    const nodePairs = traversePairsFromLeftToRight(node);

    const nodeToExplode = nodePairs.find(n => n.parent?.parent?.parent?.parent);
    if (nodeToExplode) {
        // 1. find value node to the left (if any) and add nodeToExplode.children[0].value
        const orderOfLeftNodeToExplode = [...valueNodeOrderMap].find(e => e[1] === nodeToExplode.children[0])?.[0];
        const valueNodeToTheLeft = orderOfLeftNodeToExplode
            ? valueNodeOrderMap.get(orderOfLeftNodeToExplode - 1)
            : undefined;

        if (
            valueNodeToTheLeft !== undefined &&
            valueNodeToTheLeft?.value !== null &&
            nodeToExplode.children[0].value !== null
        ) {
            valueNodeToTheLeft.value += nodeToExplode.children[0].value;
        }

        // 2. find value node to the right (if any) and add nodeToExplode.children[1].value
        const orderOfRightNodeToExplode = [...valueNodeOrderMap].find(e => e[1] === nodeToExplode.children[1])?.[0];
        const valueNodeToTheRight = orderOfRightNodeToExplode
            ? valueNodeOrderMap.get(orderOfRightNodeToExplode + 1)
            : undefined;

        if (
            valueNodeToTheRight !== undefined &&
            valueNodeToTheRight?.value !== null &&
            nodeToExplode.children[1].value !== null
        ) {
            valueNodeToTheRight.value += nodeToExplode.children[1].value;
        }

        // 3. replace nodeToExplode with single node with value 0
        if (nodeToExplode.parent?.children[0] === nodeToExplode) {
            nodeToExplode.parent.children[0].value = 0;
            nodeToExplode.parent.children[0].children = [];
        } else if (nodeToExplode.parent?.children[1] === nodeToExplode) {
            nodeToExplode.parent.children[1].value = 0;
            nodeToExplode.parent.children[1].children = [];
        }

        return reduce(node);
    }

    const nodeToSplit = [...valueNodeOrderMap].find(n => n[1].value && n[1].value >= 10)?.[1];
    if (nodeToSplit && nodeToSplit.value) {
        // split
        nodeToSplit.addChild(new Node(Math.floor(nodeToSplit.value / 2)));
        nodeToSplit.addChild(new Node(Math.ceil(nodeToSplit.value / 2)));
        nodeToSplit.value = null;

        return reduce(node);
    }

    // cannot explode or split -> done reducing
    return node;
}

const part1 = (snailFishes: Node<number | null>[]) => {
    const finalNode = snailFishes.reduce<Node<number | null> | undefined>((acc, curr) => {
        if (!acc) {
            return curr;
        }

        const additionNode = new Node<number | null>(null);
        additionNode.addChild(acc);
        additionNode.addChild(curr);

        return reduce(additionNode);
    }, undefined);

    return finalNode ? calculateMagnitude(finalNode) : 0;
};

const part2 = (input: string[]) => {
    let snailFishes = parseInput(input);

    let highestMagnitude = 0;
    for (let i = 0; i < snailFishes.length; i++) {
        for (let j = 0; j < snailFishes.length; j++) {
            if (i === j) {
                continue;
            }

            snailFishes = parseInput(input);
            let additionNode = new Node<number | null>(null);
            additionNode.addChild(snailFishes[i]);
            additionNode.addChild(snailFishes[j]);
            let magnitude = calculateMagnitude(reduce(additionNode));
            if (magnitude > highestMagnitude) {
                highestMagnitude = magnitude;
            }

            snailFishes = parseInput(input);
            additionNode = new Node<number | null>(null);
            additionNode.addChild(snailFishes[j]);
            additionNode.addChild(snailFishes[i]);
            magnitude = calculateMagnitude(reduce(additionNode));
            if (magnitude > highestMagnitude) {
                highestMagnitude = magnitude;
            }
        }
    }

    return highestMagnitude;
};

export const Day18 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const snailFishes = parseInput(input);

    return (
        <>
            <h2>Part 1</h2>
            <p>{part1(snailFishes)}</p>

            <hr />

            <h2>Part 2</h2>
            <p>{part2(input)}</p>
        </>
    );
};
