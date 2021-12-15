import { jsonDeepCopy, lines } from "~/util";
import { SpecificDayProps } from "./shared";

interface Point {
    x: number;
    y: number;
}

interface Fold {
    axis: "x" | "y";
    position: number;
}

type Paper = number[][];

function parseInput(input: string[]): { coordinates: Point[]; folds: Fold[] } {
    const coordinates = input.reduce<Point[]>((acc, curr) => {
        const match = curr.match(/^(\d+),(\d+)/);
        if (match) {
            acc.push({ x: Number(match[1]), y: Number(match[2]) });
        }
        return acc;
    }, []);

    const folds = input.reduce<Fold[]>((acc, curr) => {
        const match = curr.match(/^fold along (x|y)=(\d+)/);
        if (match) {
            acc.push({ axis: match[1] as any, position: Number(match[2]) });
        }
        return acc;
    }, []);

    return { coordinates, folds };
}

function foldPaper(paper: Paper, fold: Fold): Paper {
    if (fold.axis === "x") {
        const foldedPaper = jsonDeepCopy(paper);

        const endPos =
            paper[0].length % fold.position === 0
                ? paper[0].length - fold.position
                : paper[0].length - fold.position - 1;

        for (let i = 0; i < paper.length; i++) {
            for (let j = 0; j < endPos; j++) {
                foldedPaper[i][fold.position - 1 - j] |= paper[i][fold.position + 1 + j];
            }
        }

        // remove the "folded" portion of the paper
        foldedPaper.forEach(l => l.splice(fold.position));

        return foldedPaper;
    } else {
        const foldedPaper = jsonDeepCopy(paper);

        const endPos =
            paper.length % fold.position === 0 ? paper.length - fold.position : paper.length - fold.position - 1;

        for (let i = 0; i < endPos; i++) {
            for (let j = 0; j < paper[0].length; j++) {
                foldedPaper[fold.position - 1 - i][j] |= paper[fold.position + 1 + i][j];
            }
        }

        // remove the "folded" portion of the paper
        foldedPaper.splice(fold.position);

        return foldedPaper;
    }
}

function printPaper(paper: Paper): void {
    for (const l of paper) {
        console.log(l.map(x => (x > 0 ? "#" : ".")).join(""));
    }

    console.log("");
}

function createPaper(coordinates: Point[]) {
    let paperSize = { x: Math.max(...coordinates.map(c => c.x)) + 1, y: Math.max(...coordinates.map(c => c.y)) + 1 };

    // create transparent paper from coordinates
    const paper: Paper = [...Array(paperSize.y)].map(() => Array(paperSize.x).fill(0));
    coordinates.forEach(c => (paper[c.y][c.x] = 1));

    return paper;
}

const part1 = (paper: Paper, folds: Fold[]): number => {
    const foldedPaper = foldPaper(paper, folds[0]);

    const sum = foldedPaper.reduce((acc, curr) => acc + curr.reduce((a, b) => a + b, 0), 0);
    console.log(sum);

    return sum;
};

const part2 = (paper: Paper, folds: Fold[]): Paper => {
    const foldedPaper = folds.reduce((acc, curr) => foldPaper(acc, curr), paper);
    printPaper(foldedPaper);

    return foldedPaper;
};

export const Day13 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const { coordinates, folds } = parseInput(input);
    const paper = createPaper(coordinates);

    const _ = part2(paper, folds);

    return (
        <>
            <h2>Part 1</h2>
            <p>{part1(paper, folds)}</p>

            <hr />

            <h2>Part 2</h2>
            <p>TODO VISUALIZE</p>
        </>
    );
};
