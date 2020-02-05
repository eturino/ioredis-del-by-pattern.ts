import { CommonParams, RedisDeletionMethod } from "./types";

/**
 * Uses a scan stream and a pipeline to send UNLINK or DEL commands in batches
 *
 * Loads a scanStream with the given pattern, as well as a pipeline.
 *
 * On each stream data event, it will add unlink/del commands to the pipeline.
 * When the batch gets to the limit, the pipeline is executed and the action logged. A new pipeline is then opened.
 * At the end of the stream, the current pipeline is executed and the action logged.
 *
 * The implementation is heavily based on https://medium.com/oyotech/finding-and-deleting-the-redis-keys-by-pattern-the-right-way-123629d7730
 *
 * @param pattern
 * @param redis
 * @param batchLimit
 * @param deletionMethod
 * @param logFn
 * @param logPrefix
 */
export function batched({
  pattern,
  redis,
  batchLimit,
  deletionMethod,
  logFn,
  logPrefix
}: CommonParams & { batchLimit: number }): void {
  const stream = redis.scanStream({ match: pattern });
  let pipeline = redis.pipeline();
  let localKeys: string[] = [];
  let batchCount = 0;

  stream.on("data", (resultKeys: string[]) => {
    logFn(`${logPrefix}Data Received`, resultKeys.length, localKeys.length);
    if (deletionMethod === RedisDeletionMethod.unlink) {
      // missing in the typings
      // @ts-ignore
      pipeline.unlink(...resultKeys);
    } else {
      pipeline.del(...resultKeys);
    }

    localKeys = localKeys.concat(resultKeys);

    if (localKeys.length > batchLimit) {
      pipeline.exec(() => {
        logFn(`${logPrefix}batch number ${batchCount} complete`);
      });
      batchCount++;
      localKeys = [];
      pipeline = redis.pipeline();
    }
  });

  stream.on("end", () => {
    pipeline.exec(() => {
      logFn(`${logPrefix}batch number ${batchCount} complete [FINAL]`);
    });
  });

  stream.on("error", err => {
    logFn(`${logPrefix}error`, err);
  });
}
