import day1 from "./inputs/day1_input.txt";
import day2 from "./inputs/day2_input.txt";
import day3 from "./inputs/day3_input.txt";

export interface DayData {
    day: number;
    fileData?: string;
}

export const getInputData = async ({
    day,
}: {
    day: number;
}): Promise<DayData> => {
    let fileData = undefined;
    switch (day) {
        case 1:
            fileData = day1;
            break;
        case 2:
            fileData = day2;
            break;
        case 3:
            fileData = day3;
            break;
    }

    return { day, fileData };
};
