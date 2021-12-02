import React from "react";
import { useLoaderData } from "remix";
import { DayData } from "~/day";

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
    fileData: string | undefined;
    name: string;
}

export const Day = ({ content, fileData, name }: DayProps) => {
    if (fileData === undefined) {
        return (
            <div>
                <p>Did you forget to load file data?</p>
            </div>
        );
    }

    return (
        <div>
            <h1>{name}</h1>
            {content}
        </div>
    );
};
