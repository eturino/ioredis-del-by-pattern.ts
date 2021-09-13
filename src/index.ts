import { prepareLogFn } from "./prepare-log-fn";
import { runWithPipeline } from "./run-with-pipeline";
import { runWithoutPipeline } from "./run-without-pipeline";
import { RedisDelByPatternOptions, RedisDeletionMethod } from "./types";

export { LogFn, RedisDelByPatternOptions, RedisDeletionMethod } from "./types";

/**
 *
 *
 * @param redis redis client
 * @param pattern match in the redis scan stream
 * @param deletionMethod determines the usage of DEL or UNLINK commands (Unlink by default)
 * @param withPipeline decide to use a pipeline to execute the commands or on each stream event
 * @param pipelineBatchLimit 100 by default, in effect if `withPipeline` is true
 * @param enableLog if true, actions will be logged using the given logFn
 * @param logFn function to execute to log events. Defaults to (console.log)
 * @param logWarnFn function to execute to log events of type `warn`. Defaults to (console.warn)
 * @param logPrefix prefix to the logFn (defaults to `"[REDIS-DEL-BY-PATTERN] "`)
 */
export async function redisDelByPattern({
  pattern,
  redis,
  withPipeline,
  enableLog,
  pipelineBatchLimit = 100,
  deletionMethod = RedisDeletionMethod.unlink,
  logFn,
  logWarnFn,
  logPrefix = "[REDIS-DEL-BY-PATTERN] ",
}: RedisDelByPatternOptions): Promise<number> {
  const fn = prepareLogFn(enableLog || false, logFn);
  const warnFn = prepareLogFn(enableLog || false, logWarnFn);

  if (withPipeline) {
    return runWithPipeline({
      pattern,
      redis,
      pipelineBatchLimit,
      logFn: fn,
      logWarnFn: warnFn,
      logPrefix,
      deletionMethod,
    });
  }

  return runWithoutPipeline({
    pattern,
    redis,
    logFn: fn,
    logWarnFn: warnFn,
    logPrefix,
    deletionMethod,
  });
}

export default redisDelByPattern;
