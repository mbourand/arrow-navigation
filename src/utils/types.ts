export type MakeOptional<T extends object, Keys extends keyof T> = Omit<T, Keys> & { [K in Keys]?: T[K] }
