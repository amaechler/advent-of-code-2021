import { LoaderFunction, useLoaderData } from "remix";
import { getInputData } from "~/day";

export const loader: LoaderFunction = async ({}) => {
    return getInputData(1);
};

export default function SomeRouteComponent() {
    const fileData = useLoaderData();

    return (
        <div>
            <h1>Look ma!</h1>
            <p>I'm still using React after like 7 years.</p>
            {fileData}
        </div>
    );
}
