import { LogFn } from "./types";

/**
 * @ignore
 * @param enableLog
 * @param logFn
 */
export function prepareLogFn(enableLog: boolean, logFn?: LogFn): LogFn {
  if (!enableLog) return (): void => {};
  return (
    logFn ||
    ((...args: any[]): void => {
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
    ((...args: any[]): void => {
      console.warn(...args);
    })
  );
}
