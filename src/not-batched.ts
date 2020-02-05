import { CommonParams, RedisDeletionMethod } from "./types";

/**
 * Uses a scan stream, sending UNLINK or DEL commands with each data event
 *
 * Loads a scanStream with the given pattern.
 *
 * On each stream data event, it will send unlink/del command to the client.
 * At the end of the stream, the event is logged.
 *
 * @param pattern
 * @param redis
 * @param logFn
 * @param logPrefix
 * @param deletionMethod
 */
export function notBatched({
  pattern,
  redis,
  logFn,
  logPrefix,
  deletionMethod
}: CommonParams): void {
  const stream = redis.scanStream({ match: pattern });

  stream.on("data", (resultKeys: string[]) => {
    if (resultKeys.length) {
      if (deletionMethod === RedisDeletionMethod.unlink) {
        redis.unlink(...resultKeys);
      } else {
        redis.del(...resultKeys);
      }
      logFn(`${logPrefix} deleting ${resultKeys.length} keys`);
    }
  });

  stream.on("error", err => {
    logFn(`${logPrefix}error`, err);
  });
}
