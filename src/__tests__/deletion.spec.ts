import { describe, expect, it, vi } from "vitest";
import { type LogFn, RedisDeletionMethod, redisDelByPattern } from "..";
import { prepareLogFn, prepareLogWarningFn } from "../prepare-log-fn";
import { buildKeyMap, buildRandomString, withRedis } from "./test-utils";

const randomString = buildRandomString();

describe("redisDelByPattern()", () => {
  for (const withPipeline of [true, false]) {
    describe(`redisDelByPattern({ withPipeline: ${withPipeline})`, () => {
      const configs = [{ deletionMethod: RedisDeletionMethod.unlink }, { deletionMethod: RedisDeletionMethod.del }];

      for (const { deletionMethod } of configs) {
        describe(`using ${deletionMethod} (${withPipeline ? "with pipeline" : "without pipeline"})`, () => {
          const suitePrefix = `${randomString}|${deletionMethod}|${withPipeline}`;
          it("deletes the right ones, keeps the rest", async () => {
            await withRedis(0, async (redis) => {
              const prefix = `${suitePrefix}|DELETES|`;
              const globalPattern = `${prefix}*`;

              await redis.mset(buildKeyMap(20, `${prefix}-delete-me`));
              await redis.mset(buildKeyMap(20, `${prefix}-keep-me`));

              const allKeys = await redis.keys(globalPattern);
              expect(allKeys.length).toEqual(40);

              const result = await redisDelByPattern({
                pattern: `${prefix}-delete-me*`,
                redis,
                withPipeline,
                deletionMethod,
                enableLog: true,
              });
              const afterDel = await redis.keys(globalPattern);
              expect(afterDel.length).toEqual(20);
              expect(result).toEqual(20);
            });
            expect.assertions(3);
          });

          it("works fine if there is nothing to delete", async () => {
            const prefix = `${suitePrefix}|NOTHING|`;
            const globalPattern = `${prefix}*`;

            await withRedis(0, async (redis) => {
              await redis.mset(buildKeyMap(20, `${prefix}-keep-me`));
              await redis.mset(buildKeyMap(20, `${prefix}-and-me`));

              const logFn: LogFn = vi.fn(prepareLogFn(false));
              const logWarnFn: LogFn = vi.fn(prepareLogWarningFn(false));

              const allKeys = await redis.keys(globalPattern);
              expect(allKeys.length).toEqual(40);

              const result = await redisDelByPattern({
                pattern: `${prefix}-delete-me*`,
                redis,
                withPipeline,
                deletionMethod,
                enableLog: true,
                logFn,
                logWarnFn,
              });
              const afterDel = await redis.keys(globalPattern);
              expect(afterDel.length).toEqual(40);
              expect(result).toEqual(0);

              expect(logFn).toBeCalledTimes(1);
              if (withPipeline) {
                expect(logWarnFn).toBeCalled();
              } else {
                expect(logWarnFn).not.toBeCalled();
              }
            });
            expect.assertions(5);
          });
        });
      }
    });
  }
});
