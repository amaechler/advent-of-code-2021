import { hrtime } from "process";

export function measureTime(actionName: string, action: () => void) {
    const start = hrtime.bigint();

    action();

    const end = hrtime.bigint();

    console.log(`Action ${actionName} took ${(end - start) / BigInt(1000)} μs`);
}
