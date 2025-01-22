import type { Redis } from "ioredis";

export enum RedisDeletionMethod {
  del = "del",
  unlink = "unlink",
}

export type LogFn = (...args: unknown[]) => void;

export type RedisDelByPatternOptions = {
  pattern: string;
  redis: Redis;
  withPipeline?: boolean;
  pipelineBatchLimit?: number;
  deletionMethod: RedisDeletionMethod;
  enableLog?: boolean;
  logFn?: LogFn;
  logWarnFn?: LogFn;
  logPrefix?: string;
};

/**
 * @ignore
 */
export type CommonParams = {
  pattern: string;
  redis: Redis;
  logFn: LogFn;
  logWarnFn: LogFn;
  logPrefix: string;
  deletionMethod: RedisDeletionMethod;
};
