import { lines } from "~/util";
import { SpecificDayProps } from "./shared";

function parseInput(input: string[]): number[] {
    if (input.length > 1) {
        throw new Error("Expected a single line");
    }

    return input[0]
        .split("")
        .map(c =>
            parseInt(c, 16)
                .toString(2)
                .padStart(4, "0")
                .split("")
                .map(b => Number(b))
        )
        .flat();
}

interface Packet {
    version: number;
    typeId: number;

    /** literal value (if typeId === 4) or operator value (part 2). */
    value: number;

    /** sub packets (only if typeId !== 4). */
    subPackets?: Packet[];
}

function parsePackage(stream: number[], currentPosition: number): { packet: Packet; updatedPosition: number } {
    // parse version and type
    const version = Number(`0b${stream.slice(currentPosition, currentPosition + 3).join("")}`);
    const typeId = Number(`0b${stream.slice(currentPosition + 3, currentPosition + 6).join("")}`);
    currentPosition += 6;

    if (typeId === 4) {
        // literal value packet

        // take group of 5 bits until the last group, which is denoted by a leading 0 (instead a 1)
        const literalValue = [];
        for (;;) {
            literalValue.push(...stream.slice(currentPosition + 1, currentPosition + 5));
            currentPosition += 5;
            if (stream[currentPosition - 5] === 0) {
                break;
            }
        }

        return {
            packet: {
                version,
                typeId,
                value: Number(`0b${literalValue.join("")}`)
            },
            updatedPosition: currentPosition
        };
    } else {
        // operator packet
        const subPackets: Packet[] = [];

        const lengthTypeId = stream[currentPosition++];
        if (lengthTypeId === 0) {
            // the next 15 bits are a number that represents the total
            // length in bits of the sub-packets contained by this packet

            const totalSubPacketsLength = Number(`0b${stream.slice(currentPosition, currentPosition + 15).join("")}`);
            currentPosition += 15;

            const subPacketStream = stream.slice(currentPosition, currentPosition + totalSubPacketsLength);
            let subPacketPosition = 0;
            while (subPacketPosition < totalSubPacketsLength) {
                const { packet, updatedPosition } = parsePackage(subPacketStream, subPacketPosition);
                subPackets.push(packet);
                subPacketPosition = updatedPosition;
            }

            currentPosition += totalSubPacketsLength;
        } else {
            // the next 11 bits are a number that represents the number of
            // sub-packets immediately contained by this packet

            const numberOfSubPacketsContained = Number(
                `0b${stream.slice(currentPosition, currentPosition + 11).join("")}`
            );
            currentPosition += 11;

            for (let i = 0; i < numberOfSubPacketsContained; i++) {
                const { packet, updatedPosition } = parsePackage(stream, currentPosition);
                subPackets.push(packet);

                currentPosition = updatedPosition;
            }
        }

        // calculate operator value
        let value = -1;
        switch (typeId) {
            case 0:
                value = subPackets.reduce((acc, curr) => acc + curr.value, 0);
                break;
            case 1:
                value = subPackets.reduce((acc, curr) => acc * curr.value, 1);
                break;
            case 2:
                value = Math.min(...subPackets.map(s => s.value));
                break;
            case 3:
                value = Math.max(...subPackets.map(s => s.value));
                break;
            case 5:
                value = subPackets[0].value > subPackets[1].value ? 1 : 0;
                break;
            case 6:
                value = subPackets[0].value < subPackets[1].value ? 1 : 0;
                break;
            case 7:
                value = subPackets[0].value === subPackets[1].value ? 1 : 0;
                break;
            default:
                throw new Error(`Unknown operator packet type id: ${typeId}`);
        }

        return {
            packet: {
                version,
                typeId,
                value,
                subPackets
            },
            updatedPosition: currentPosition
        };
    }
}

const part1 = (input: number[]) => {
    const { packet } = parsePackage(input, 0);

    // sum up all version values
    const sumVersions = (packet: Packet): number =>
        packet.version + (packet.subPackets?.reduce((acc, curr) => acc + sumVersions(curr), 0) ?? 0);

    return sumVersions(packet);
};

const part2 = (input: number[]) => {
    const { packet } = parsePackage(input, 0);

    return packet.value;
};

export const Day16 = ({ fileData }: SpecificDayProps) => {
    if (fileData === undefined) {
        return null;
    }

    const input = lines(fileData);
    const binaryRepresentation = parseInput(input);

    return (
        <>
            <h2>Part 1</h2>
            <p>Sum of versions: {part1(binaryRepresentation)}</p>

            <hr />

            <h2>Part 2</h2>
            <p>Value of most outer package: {part2(binaryRepresentation)}</p>
        </>
    );
};
