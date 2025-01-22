import { type CommonParams, RedisDeletionMethod } from "./types";

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
export function runWithoutPipeline({
  pattern,
  redis,
  logFn,
  logPrefix,
  deletionMethod,
}: CommonParams): Promise<number> {
  return new Promise((resolve, reject) => {
    const stream = redis.scanStream({ match: pattern });
    let totalCount = 0;

    stream.on("data", (resultKeys: string[]) => {
      if (resultKeys.length) {
        if (deletionMethod === RedisDeletionMethod.unlink) {
          redis.unlink(...resultKeys);
        } else {
          redis.del(...resultKeys);
        }
        logFn(`${logPrefix} deleting ${resultKeys.length} keys`);
        totalCount = totalCount + resultKeys.length;
      }
    });

    stream.on("end", () => {
      logFn(`${logPrefix} finished deleting. Total keys ${totalCount}`);
      resolve(totalCount);
    });

    stream.on("error", (err) => {
      logFn(`${logPrefix}error`, err);
      reject(err);
    });
  });
}
