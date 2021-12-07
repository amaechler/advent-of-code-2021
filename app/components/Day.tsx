import React from "react";
import { githubDayLocation } from "~/util";

import githubLogo from "~/images/github.svg";
import { Link } from "remix";

export interface DayProps {
    children: React.ReactChild | null;
    day: number;
}

export const Day = ({ children, day }: DayProps) => {
    return (
        <div>
            <h2>Day {day}</h2>
            {children}
            <div className="centered spaced">
                <Link to={`/days/${day - 1}`}>🠔</Link>
                <a href={githubDayLocation(`Day${day}.tsx`)}>
                    <img src={githubLogo} width="16px" />
                </a>
                <Link to={`/days/${day + 1}`}>🠖</Link>
            </div>
        </div>
    );
};
