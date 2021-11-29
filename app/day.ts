import day1 from "./inputs/day1_input.txt";

export const getInputData = async (day: number) => {
    switch (day) {
        case 1:
            return day1;
    }

    return undefined;
};
