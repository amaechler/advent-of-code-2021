import React from "react";
import { githubDayLocation } from "~/util";

import githubLogo from "~/images/github.svg";
import { Link } from "remix";
import { implementedDays } from "~/days";

export interface DayProps {
    children: React.ReactChild | null;
    day: number;
}

export const Day = ({ children, day }: DayProps) => {
    const linkToPreviousDay = implementedDays.includes(day - 1) && (
        <Link to={`/days/${day - 1}`} prefetch="intent">
            🠔
        </Link>
    );

    const linkToNextDay = implementedDays.includes(day + 1) && (
        <Link to={`/days/${day + 1}`} prefetch="intent">
            🠖
        </Link>
    );
    const linkToSource = (
        <a href={githubDayLocation(`Day${day}.tsx`)}>
            <img src={githubLogo} width="16px" />
        </a>
    );

    return (
        <div>
            <h2>Day {day}</h2>
            {children}
            <div className="centered spaced">
                {linkToPreviousDay}
                {linkToSource}
                {linkToNextDay}
            </div>
        </div>
    );
};
