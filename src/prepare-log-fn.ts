import { LogFn } from "./types";

/**
 * @ignore
 * @param enableLog
 * @param logFn
 */
export function prepareLogFn(enableLog: boolean, logFn?: LogFn): LogFn {
  // tslint:disable-next-line:no-empty
  if (!enableLog) return (): void => {};
  return (
    logFn ||
    ((...args): void => {
      // tslint:disable-next-line:no-console
      console.log(...args);
    })
  );
}
