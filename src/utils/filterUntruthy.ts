export const filterUntruthy = <T>(arr: (T | false | null | undefined | 0)[]): T[] =>
  arr.filter((item): item is T => Boolean(item))
