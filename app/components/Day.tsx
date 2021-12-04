import React from "react";
import { githubDayLocation } from "~/util";

export interface DayProps {
    children: React.ReactChild | null;
    day: number;
}

export const Day = ({ children, day }: DayProps) => {
    return (
        <div>
            <h2>Day {day}</h2>
            {children}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "20px"
                }}
            >
                (<a href={githubDayLocation(`day${day}.tsx`)}>Source</a>)
            </div>
        </div>
    );
};
