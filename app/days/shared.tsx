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
import { Day10 } from "./Day10";
import day10 from "./day10_input.txt";
import { Day11 } from "./Day11";
import day11 from "./day11_input.txt";
import { Day12 } from "./Day12";
import day12 from "./day12_input.txt";
import { Day13 } from "./Day13";
import day13 from "./day13_input.txt";
import { Day14 } from "./Day14";
import day14 from "./day14_input.txt";
import { Day15 } from "./Day15";
import day15 from "./day15_input.txt";
import { Day16 } from "./Day16";
import day16 from "./day16_input.txt";
import { Day17 } from "./Day17";
import day17 from "./day17_input.txt";
import { Day18 } from "./Day18";
import day18 from "./day18_input.txt";
import { Day19 } from "./Day19";
import day19 from "./day19_input.txt";
import { Day20 } from "./Day20";
import day20 from "./day20_input.txt";
import { Day21 } from "./Day21";
import day21 from "./day21_input.txt";
import { Day22 } from "./Day22";
import day22 from "./day22_input.txt";
import { Day23 } from "./Day23";
import day23 from "./day23_input.txt";
import { Day24 } from "./Day24";
import day24 from "./day24_input.txt";
import { Day25 } from "./Day25";
import day25 from "./day25_input.txt";

export const implementedDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

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
    9: { component: Day9, input: day9 },
    10: { component: Day10, input: day10 },
    11: { component: Day11, input: day11 },
    12: { component: Day12, input: day12 },
    13: { component: Day13, input: day13 },
    14: { component: Day14, input: day14 },
    15: { component: Day15, input: day15 },
    16: { component: Day16, input: day16 },
    17: { component: Day17, input: day17 },
    18: { component: Day18, input: day18 },
    19: { component: Day19, input: day19 },
    20: { component: Day20, input: day20 },
    21: { component: Day21, input: day21 },
    22: { component: Day22, input: day22 },
    23: { component: Day23, input: day23 },
    24: { component: Day24, input: day24 },
    25: { component: Day25, input: day25 }
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
