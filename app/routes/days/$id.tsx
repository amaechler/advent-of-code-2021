import { LoaderFunction, useLoaderData } from "remix";
import { Day } from "~/components";
import { allDays, DayData, getDayData } from "~/days";

import styles from "~/styles/day.css";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export const loader: LoaderFunction = async ({ params }) => {
    const parsedDay = Number(params.id);
    if (isNaN(parsedDay)) {
        throw new Error("Expected params.id to be a number");
    }

    return getDayData({ day: parsedDay });
};

export default function DayWithData() {
    const { day, fileData } = useLoaderData<DayData>();

    const notImplemented = !Object.prototype.hasOwnProperty.call(allDays, day) ? (
        <div>
            <p>Day {day} has not been implemented.</p>
        </div>
    ) : null;

    const noFileData =
        !notImplemented && fileData === undefined ? (
            <div>
                <p>Did you forget to load file data?</p>
            </div>
        ) : null;

    const SpecificDayComponent = allDays[day].component;

    return (
        <Day day={day}>
            <>
                {notImplemented}
                {noFileData}
                {!notImplemented && !noFileData && <SpecificDayComponent day={day} fileData={fileData} />}
            </>
        </Day>
    );
}
