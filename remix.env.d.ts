/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

declare module "*.txt" {
    const asset: string;
    export default asset;
}
