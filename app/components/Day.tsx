import React from "react";
import { githubDayLocation } from "~/util";

// Better children types, inspired by this https://fettblog.eu/react-types-for-children-are-broken/

type ReactNode =
    | React.ReactChild
    | React.ReactNodeArray
    | ReadonlyArray<ReactNode>
    | React.ReactPortal
    | boolean
    | null
    | undefined;

export interface Children {
    content?: ReactNode;
}

export interface DayProps {
    content: React.ReactChild | null;
    day: number;
    fileData: string | undefined;
}

export const Day = ({ content, day, fileData }: DayProps) => {
    if (fileData === undefined) {
        return (
            <div>
                <p>Did you forget to load file data?</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Day {day}</h1>
            {content}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "20px",
                }}
            >
                (<a href={githubDayLocation(`day${day}.tsx`)}>Source</a>)
            </div>
        </div>
    );
};
