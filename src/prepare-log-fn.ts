import type { LogFn } from "./types";

/**
 * @ignore
 * @param enableLog
 * @param logFn
 */
export function prepareLogFn(enableLog: boolean, logFn?: LogFn): LogFn {
  if (!enableLog) return (): void => {};
  return (
    logFn ||
    ((...args: unknown[]): void => {
      console.log(...args);
    })
  );
}

/**
 * @ignore
 * @param enableLog
 * @param logFn
 */
export function prepareLogWarningFn(enableLog: boolean, logFn?: LogFn): LogFn {
  if (!enableLog) return (): void => {};
  return (
    logFn ||
    ((...args: unknown[]): void => {
      console.warn(...args);
    })
  );
}
