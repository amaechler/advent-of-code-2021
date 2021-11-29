import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";

interface IndexData {
    days: Array<number>;
}

export let loader: LoaderFunction = () => {
    let data: IndexData = {
        // days implemented
        // [...Array(25).keys()]
        days: [1],
    };

    // https://remix.run/api/remix#json
    return json(data);
};

export let meta: MetaFunction = () => {
    return {
        title: "Advent of Code 2021",
        description: "Remix Party",
    };
};

export default function Index() {
    let data = useLoaderData<IndexData>();

    return (
        <div className="remix__page">
            <main>
                <h2>Days</h2>
                <ul>
                    {data.days.map((day) => (
                        <li key={day} className="remix__page__resource">
                            <Link to={`days/day${day}`} prefetch="intent">
                                Day {day}
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}
