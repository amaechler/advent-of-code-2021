import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import { implementedDays } from "~/days";

interface IndexData {
    days: Array<number>;
}

export const loader: LoaderFunction = () => {
    const data: IndexData = {
        days: implementedDays
    };

    return json(data);
};

export const meta: MetaFunction = () => {
    return {
        title: "Advent of Code 2021",
        description: "Remix Party"
    };
};

export default function Index() {
    const data = useLoaderData<IndexData>();

    return (
        <div className="remix__page">
            <main>
                <h2>Days</h2>
                <ul>
                    {data.days.map(day => (
                        <li key={day} className="remix__page__resource">
                            <Link to={`days/${day}`} prefetch="intent">
                                Day {day}
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
