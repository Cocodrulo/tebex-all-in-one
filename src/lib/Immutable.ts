export type Immutable<T> = {
    readonly [K in keyof T]: T[K] extends object ? Immutable<T[K]> : T[K];
};

export function deepFreeze<T extends object>(obj: T): Immutable<T> {
    const propNames = Object.getOwnPropertyNames(obj);
    for (const name of propNames) {
        const value = (obj as Record<string, unknown>)[name];
        if (value && typeof value === "object") {
            deepFreeze(value as object);
        }
    }
    return Object.freeze(obj);
}
