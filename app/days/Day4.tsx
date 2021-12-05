import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

function parseInput(input: string[]) {
    const randomNumbers = input[0].split(",").map(i => Number(i));

    const boardSize = 5 * 5;
    const boards = [];
    let tempBoard = [];
    for (let i = 2; i < input.length; i++) {
        if (tempBoard.length === boardSize) {
            boards.push(tempBoard);
            tempBoard = [];
        }

        tempBoard.push(
            ...input[i]
                .split(" ")
                .filter(s => s !== "")
                .map(i => Number(i))
        );
    }
    boards.push(tempBoard);

    return { randomNumbers, boards };
}

function checkBoardForWinners(boards: number[][]): number[] | null {
    const winners: number[] = [];

    for (let i = 0; i < boards.length; i++) {
        const board = boards[i];

        // check for winner rows
        const rowWinner = board
            .reduce<number[][]>((acc, _, i) => {
                if (i % 5 === 0) {
                    acc.push(board.slice(i, i + 5));
                }

                return acc;
            }, [])
            .some(r => r.every(n => n === -1));

        if (rowWinner) {
            winners.push(i);
            continue;
        }

        // check for winner columns
        const columnWinner = board
            .reduce<number[][]>((acc, _, i) => {
                if (i % 5 === 0) {
                    const column = [];
                    for (let j = 0; j < 5; j++) {
                        column.push(board[i / 5 + j * 5]);
                    }
                    acc.push(column);
                }

                return acc;
            }, [])
            .some(r => r.every(n => n === -1));

        if (columnWinner) {
            winners.push(i);
            continue;
        }
    }

    return winners.length > 0 ? winners : null;
}

export const Day4 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const { randomNumbers, boards } = parseInput(input);

    const part1 = () => {
        const markedBoards = [...boards];

        for (const r of randomNumbers) {
            // mark all hits '-1'
            for (let i = 0; i < markedBoards.length; i++) {
                for (let j = 0; j < markedBoards[i].length; j++) {
                    if (markedBoards[i][j] === r) {
                        markedBoards[i][j] = -1;
                    }
                }
            }

            // check for winners
            const winnerBoards = checkBoardForWinners(markedBoards);
            if (winnerBoards !== null) {
                for (const w of winnerBoards) {
                    console.log(`Board ${w + 1} wins first 🎉`);
                }

                // calculate sum - if there are multiple winners, simply pick the first one
                return markedBoards[winnerBoards[0]].filter(x => x !== -1).reduce((a, b) => a + b, 0) * r;
            }
        }

        return null;
    };

    const part2 = () => {
        const markedBoards = [...boards];

        const winnerBoardsSoFar = [];
        for (const r of randomNumbers) {
            // mark all hits '-1'
            for (let i = 0; i < markedBoards.length; i++) {
                for (let j = 0; j < markedBoards[i].length; j++) {
                    if (markedBoards[i][j] === r) {
                        markedBoards[i][j] = -1;
                    }
                }
            }

            // check for winners
            const winnerBoards = checkBoardForWinners(markedBoards);
            if (winnerBoards !== null) {
                winnerBoardsSoFar.push(...winnerBoards);
                for (const w of winnerBoards) {
                    console.log(`Board ${w + 1} is a winner (${winnerBoardsSoFar.length}/${boards.length})`);
                }

                // was this the last board?
                if (winnerBoardsSoFar.length === boards.length) {
                    for (const w of winnerBoards) {
                        console.log(`Board ${w + 1} wins last 🎉`);
                    }

                    // calculate sum - if there are multiple winners, simply pick the first one
                    return markedBoards[winnerBoards[0]].filter(x => x !== -1).reduce((a, b) => a + b, 0) * r;
                }

                // remove that board, we don't care about it anymore
                for (const w of winnerBoards) {
                    markedBoards[w] = [];
                }
            }
        }

        return null;
    };

    return (
        <>
            <h2>Part 1</h2>
            <p>Sum: {part1()}</p>

            <hr />

            <h2>Part 2</h2>
            <p>Sum: {part2()}</p>
        </>
    );
};
