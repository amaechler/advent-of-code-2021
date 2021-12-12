export function sortBy<TObject, TKey extends keyof TObject>(object: TObject[], key: TKey): TObject[] {
    if (!object) {
        return object;
    }

    return object.sort((a: any, b: any) => {
        if (typeof a[key] === "string" && typeof b[key] === "string") {
            return a[key].localeCompare(b[key]);
        }

        if (a[key] < b[key]) {
            return -1;
        }

        if (a[key] > b[key]) {
            return 1;
        }

        return 0;
    });
}
