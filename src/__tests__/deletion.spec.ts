import uuidv4 from "uuid/v4";
import { redisDelByPattern, RedisDeletionMethod } from "../index";
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
        });
      });
    });
  });
});
