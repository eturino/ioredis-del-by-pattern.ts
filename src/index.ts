import { batched } from "./batched";
import { notBatched } from "./not-batched";
import { prepareLogFn } from "./prepare-log-fn";
import { RedisDelByPatternOptions, RedisDeletionMethod } from "./types";

export { LogFn, RedisDelByPatternOptions, RedisDeletionMethod } from "./types";

/**
 *
 *
 * @param redis redis client
 * @param pattern match in the redis scan stream
 * @param deletionMethod determines the usage of DEL or UNLINK commands (Unlink by default)
 * @param inBatches decide to use a pipeline to execute the commands or on each stream event
 * @param batchLimit 100 by default, in effect if `inBatches` is true
 * @param enableLog if true, actions will be logged using the given logFn
 * @param logFn function to execute to log events. Defaults to (console.log)
 * @param logPrefix prefix to the logFn (defaults to `"[REDIS-DEL-BY-PATTERN] "`)
 */
export function redisDelByPattern({
  pattern,
  redis,
  inBatches,
  enableLog,
  batchLimit = 100,
  deletionMethod = RedisDeletionMethod.unlink,
  logFn,
  logPrefix = "[REDIS-DEL-BY-PATTERN] "
}: RedisDelByPatternOptions): void {
  const fn = prepareLogFn(enableLog || false, logFn);
  if (inBatches) {
    batched({ pattern, redis, batchLimit, logFn: fn, logPrefix, deletionMethod });
  } else {
    notBatched({ pattern, redis, logFn: fn, logPrefix, deletionMethod });
  }
}

export default redisDelByPattern;
