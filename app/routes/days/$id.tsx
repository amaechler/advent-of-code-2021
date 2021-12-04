import { LoaderFunction, useLoaderData } from "remix";
import { Day } from "~/components";
import { allDayComponents, DayData, getDayData } from "~/days";

export const loader: LoaderFunction = async ({ params }) => {
    const parsedDay = Number(params.id);
    if (isNaN(parsedDay)) {
        throw new Error("Expected params.id to be a number");
    }

    return getDayData({ day: parsedDay });
};

export default function DayWithData() {
    const { day, fileData } = useLoaderData<DayData>();

    if (!Object.prototype.hasOwnProperty.call(allDayComponents, day)) {
        return (
            <div>
                <p>Day {day} does not exist.</p>
            </div>
        );
    }

    if (fileData === undefined) {
        return (
            <div>
                <p>Did you forget to load file data?</p>
            </div>
        );
    }

    const SpecificDayComponent = allDayComponents[day];
    return (
        <Day day={day}>
            <SpecificDayComponent day={day} fileData={fileData} />
        </Day>
    );
}
