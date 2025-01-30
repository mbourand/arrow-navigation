export const isKeyOf = <T extends object>(obj: T, key: unknown): key is keyof T =>
  (typeof key === 'string' || typeof key === 'symbol' || typeof key === 'number') && key in obj
