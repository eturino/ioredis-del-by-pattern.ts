import { v4 as uuidv4 } from "uuid";
import { LogFn, redisDelByPattern, RedisDeletionMethod } from "../index";
import { prepareLogFn, prepareLogWarningFn } from "../prepare-log-fn";
import { buildKeyMap, withRedis } from "./test-utils";

describe("redisDelByPattern()", () => {
  [true, false].forEach((withPipeline) => {
    describe(`redisDelByPattern({ withPipeline: ${withPipeline})`, () => {
      [
        {
          deletionMethod: RedisDeletionMethod.unlink,
          db: withPipeline ? 1 : 3,
        },
        { deletionMethod: RedisDeletionMethod.del, db: withPipeline ? 2 : 4 },
      ].forEach(({ deletionMethod, db }) => {
        describe(`using ${deletionMethod}`, () => {
          it("deletes the right ones, keeps the rest", async () => {
            const prefix = `${db}--${uuidv4()}-${withPipeline}-${deletionMethod}`;
            const globalPattern = `${prefix}*`;

            await withRedis(db, async (redis) => {
              await redis.mset(buildKeyMap(200, `${prefix}-delete-me`));
              await redis.mset(buildKeyMap(200, `${prefix}-keep-me`));

              const allKeys = await redis.keys(globalPattern);
              expect(allKeys.length).toEqual(400);

              const result = await redisDelByPattern({
                pattern: `${prefix}-delete-me*`,
                redis,
                withPipeline,
                deletionMethod,
                enableLog: true,
              });
              const afterDel = await redis.keys(globalPattern);
              expect(afterDel.length).toEqual(200);
              expect(result).toEqual(200);
            });
            expect.assertions(3);
          });

          it("works fine if there is nothing to delete", async () => {
            const prefix = `${db}--${uuidv4()}-${withPipeline}-${deletionMethod}`;
            const globalPattern = `${prefix}*`;

            await withRedis(db, async (redis) => {

              await redis.mset(buildKeyMap(200, `${prefix}-keep-me`));
              await redis.mset(buildKeyMap(200, `${prefix}-and-me`));

              const logFn: LogFn = jest.fn(prepareLogFn(false))
              const logWarnFn: LogFn = jest.fn(prepareLogWarningFn(false))

              const allKeys = await redis.keys(globalPattern);
              expect(allKeys.length).toEqual(400);

              const result = await redisDelByPattern({
                pattern: `${prefix}-delete-me*`,
                redis,
                withPipeline,
                deletionMethod,
                enableLog: true,
                logFn,
                logWarnFn
              });
              const afterDel = await redis.keys(globalPattern);
              expect(afterDel.length).toEqual(400);
              expect(result).toEqual(0);

              expect(logFn).toBeCalledTimes(1)
              if (withPipeline) {
                expect(logWarnFn).toBeCalled()
              } else {
                expect(logWarnFn).not.toBeCalled()
              }
            });
            expect.assertions(5);
          });
        });
      });
    });
  });
});
