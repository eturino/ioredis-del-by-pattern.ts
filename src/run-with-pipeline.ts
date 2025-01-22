import { type CommonParams, RedisDeletionMethod } from "./types";

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
 * @param pipelineBatchLimit
 * @param deletionMethod
 * @param logFn
 * @param logPrefix
 */
export async function runWithPipeline({
  pattern,
  redis,
  pipelineBatchLimit,
  deletionMethod,
  logFn,
  logWarnFn,
  logPrefix,
}: CommonParams & { pipelineBatchLimit: number }): Promise<number> {
  return new Promise((resolve, reject) => {
    const stream = redis.scanStream({ match: pattern });
    let pipeline = redis.pipeline();
    let localKeys: string[] = [];
    let batchCount = 0;
    let totalCount = 0;

    stream.on("data", (resultKeys: string[]) => {
      if (resultKeys.length > 0) {
        logFn(`${logPrefix}Data Received (${resultKeys.length}, keys in batch: ${localKeys.length} so far)`);

        if (deletionMethod === RedisDeletionMethod.unlink) {
          pipeline.unlink(...resultKeys);
        } else {
          pipeline.del(...resultKeys);
        }
      } else {
        logWarnFn(`${logPrefix} no keys received (keys in batch: ${localKeys.length} so far). Skipping...`);
        return;
      }

      localKeys = localKeys.concat(resultKeys);

      if (localKeys.length > pipelineBatchLimit) {
        pipeline.exec(() => {
          logFn(`${logPrefix}batch number ${batchCount} complete`);
        });
        batchCount++;
        totalCount = totalCount + localKeys.length;
        localKeys = [];
        pipeline = redis.pipeline();
      }
    });

    stream.on("end", () => {
      pipeline.exec(() => {
        totalCount = totalCount + localKeys.length;
        logFn(`${logPrefix}batch number ${batchCount} complete. Total keys ${totalCount}`);
        resolve(totalCount);
      });
    });

    stream.on("error", (err) => {
      logFn(`${logPrefix}error`, err);
      reject(err);
    });
  });
}
