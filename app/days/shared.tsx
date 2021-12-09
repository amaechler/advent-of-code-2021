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
import { Day8 } from "./Day8";
import day8 from "./day8_input.txt";
import { Day9 } from "./Day9";
import day9 from "./day9_input.txt";

export const allDays: {
    [key: number]: { component: (props: SpecificDayProps) => JSX.Element | null; input: string };
} = {
    1: { component: Day1, input: day1 },
    2: { component: Day2, input: day2 },
    3: { component: Day3, input: day3 },
    4: { component: Day4, input: day4 },
    5: { component: Day5, input: day5 },
    6: { component: Day6, input: day6 },
    7: { component: Day7, input: day7 },
    8: { component: Day8, input: day8 },
    9: { component: Day9, input: day9 }
};

export interface DayData {
    day: number;
    fileData?: string;
}

export const getDayData = async ({ day }: { day: number }): Promise<DayData> => ({ day, fileData: allDays[day].input });

export interface SpecificDayProps {
    day: number;
    fileData: string | undefined;
}
