import { Day1 } from "./Day1";
import day1 from "./day1_input.txt";
import { Day2 } from "./Day2";
import day2 from "./day2_input.txt";
import { Day3 } from "./Day3";
import day3 from "./day3_input.txt";
import { Day4 } from "./Day4";
import day4 from "./day4_input.txt";
import { Day5 } from "./Day5";
import day5 from "./day5_input.txt";
import { Day6 } from "./Day6";
import day6 from "./day6_input.txt";
import { Day7 } from "./Day7";
import day7 from "./day7_input.txt";

const inputsForDays: { [key: number]: string } = {
    1: day1,
    2: day2,
    3: day3,
    4: day4,
    5: day5,
    6: day6,
    7: day7
};

export const allDayComponents: {
    [key: number]: (props: SpecificDayProps) => JSX.Element | null;
} = {
    1: Day1,
    2: Day2,
    3: Day3,
    4: Day4,
    5: Day5,
    6: Day6,
    7: Day7
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
