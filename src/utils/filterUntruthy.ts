export const filterUntruthy = <T>(arr: (T | false | null | undefined)[]): T[] =>
  arr.filter((item): item is T => Boolean(item))
