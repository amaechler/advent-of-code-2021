import { Day1 } from "./Day1";
import day1 from "./day1_input.txt";
import { Day2 } from "./Day2";
import day2 from "./day2_input.txt";
import { Day3 } from "./Day3";
import day3 from "./day3_input.txt";
import { Day4 } from "./Day4";
import day4 from "./day4_input.txt";

const inputsForDays: { [key: number]: string } = {
    1: day1,
    2: day2,
    3: day3,
    4: day4
};

export const allDayComponents: {
    [key: number]: (props: SpecificDayProps) => JSX.Element | null;
} = {
    1: Day1,
    2: Day2,
    3: Day3,
    4: Day4
};

export interface DayData {
    day: number;
    fileData?: string;
}

export const getDayData = async ({ day }: { day: number }): Promise<DayData> => ({ day, fileData: inputsForDays[day] });

export interface SpecificDayProps {
    day: number;
    fileData: string | undefined;
}
