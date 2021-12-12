import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

class Node<T> {
    constructor(public readonly value: T) {}

    addChild(node: Node<T>): void {
        this.children.push(node);
    }

    isChild(node: Node<T>) {
        return this.children.indexOf(node) > -1;
    }

    readonly children: Node<T>[] = [];
}

class Graph<T> {
    addEdge(source: T, destination: T): Node<T>[] {
        const sourceNode = this.addVertex(source);
        const destinationNode = this.addVertex(destination);

        sourceNode.addChild(destinationNode);
        destinationNode.addChild(sourceNode);

        return [sourceNode, destinationNode];
    }

    addVertex(value: T): Node<T> {
        if (this.nodes.has(value)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.nodes.get(value)!;
        } else {
            const vertex = new Node(value);
            this.nodes.set(value, vertex);
            return vertex;
        }
    }

    nodes: Map<T, Node<T>> = new Map();
}

function isLowerCase(node: Node<string>) {
    return node.value === node.value.toLowerCase();
}

function isUpperCase(node: Node<string>) {
    return node.value === node.value.toUpperCase();
}

function parseInput(input: string[]): Graph<string> {
    const graph = new Graph<string>();

    for (const line of input) {
        const match = line.match(/(\w+)-(\w+)/);
        if (!match) {
            throw new Error("Invalid line");
        }

        graph.addEdge(match[1] as string, match[2] as string);
    }

    return graph;
}

function dfsTraversal<T>({
    start,
    end,
    skipChildNode
}: {
    start: Node<T>;
    end: Node<T>;
    skipChildNode: (node: Node<T>, parentNode: Node<T>, path: Node<T>[], visitCount: Map<Node<T>, number>) => boolean;
}): Node<T>[][] {
    const paths: Node<T>[][] = [];

    const dfs = (child: Node<T>, path: Node<T>[], visitCount: Map<Node<T>, number>): void => {
        // add child to path
        path.push(child);

        // are we finished?
        if (child === end) {
            paths.push(path);
            return;
        }

        // count the current node as visited
        const currentCount = visitCount.get(child);
        visitCount.set(child, currentCount !== undefined ? currentCount + 1 : 1);

        // figure out which nodes we want to visit next
        const nodesToVisit = child.children.filter(c => {
            // do not visit start and end again
            if (c === start) {
                return false;
            }

            if (skipChildNode(c, child, path, visitCount)) {
                return false;
            }

            return true;
        });

        // give each new dfs call a copy of path and the visited map
        nodesToVisit.forEach(n => dfs(n, [...path], new Map(visitCount)));
    };

    // visit children
    for (const child of start.children) {
        dfs(child, [start], new Map<Node<T>, number>());
    }

    return paths;
}

const part1 = (input: Graph<string>) => {
    const startNode = input.nodes.get("start");
    if (!startNode) {
        throw new Error("Couldn't locate start node");
    }

    const endNode = input.nodes.get("end");
    if (!endNode) {
        throw new Error("Couldn't locate END node");
    }

    const paths = dfsTraversal({
        start: startNode,
        end: endNode,
        skipChildNode: (node, parentNode, path, visitCount) => {
            // if this is a lower-case node, only visit if not visited before
            if (isLowerCase(node)) {
                const currentVisitCount = visitCount.get(node) ?? -1;
                return currentVisitCount > 0;
            }

            // detect loops between two upper-case caves
            if (
                isUpperCase(path[path.length - 1]) &&
                path[path.length - 1] === parentNode &&
                isUpperCase(path[path.length - 2]) &&
                path[path.length - 2] === node
            ) {
                return true;
            }

            return false;
        }
    });

    return paths.length;
};

const part2 = (input: Graph<string>) => {
    const startNode = input.nodes.get("start");
    if (!startNode) {
        throw new Error("Couldn't locate start node");
    }

    const endNode = input.nodes.get("end");
    if (!endNode) {
        throw new Error("Couldn't locate end node");
    }

    const paths = dfsTraversal({
        start: startNode,
        end: endNode,
        skipChildNode: (node, parentNode, path, visitCount) => {
            if (isLowerCase(node)) {
                const loweCaseEntries = [...visitCount.entries()].filter(
                    e => isLowerCase(e[0]) && e[0] !== startNode && e[0] !== endNode
                );

                // have any other lower-case nodes been visited more than once yet or are there any that have been visited more then twice?
                return loweCaseEntries.filter(e => e[1] > 1).length > 1 || loweCaseEntries.some(e => e[1] > 2);
            }

            // detect loops between two upper-case caves
            if (
                isUpperCase(path[path.length - 1]) &&
                path[path.length - 1] === parentNode &&
                isUpperCase(path[path.length - 2]) &&
                path[path.length - 2] === node
            ) {
                return true;
            }

            return false;
        }
    });

    return paths.length;
};

export const Day12 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const graph = parseInput(input);

    return (
        <>
            <h2>Part 1</h2>
            <p>Number of paths: {part1(graph)}</p>

            <hr />

            <h2>Part 2</h2>
            <p>Number of paths: {part2(graph)}</p>
        </>
    );
};
