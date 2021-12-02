import day1 from "./inputs/day1_input.txt";
import day2 from "./inputs/day2_input.txt";

export interface DayData {
    fileData?: string;
    name: string;
}

export const getInputData = async ({
    day,
}: {
    day: number;
}): Promise<DayData> => {
    const name = `Day ${day}`;

    let fileData = undefined;
    switch (day) {
        case 1:
            fileData = day1;
            break;
        case 2:
            fileData = day2;
            break;
    }

    return { fileData, name };
};
