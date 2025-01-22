import { describe, expect, it } from "vitest";
import { buildKeyMap, buildRandomString, withRedis } from "./test-utils";

const randomString = buildRandomString();

describe("Redis", () => {
  it("flushall, del, unlink, mset and keys work", async () => {
    const prefix = `${randomString}|BASE`;
    const globalPattern = `${prefix}*`;

    await withRedis(1, async (redis) => {
      await redis.flushall();
      await redis.mset(buildKeyMap(40, prefix));

      const allKeys = await redis.keys(globalPattern);
      expect(allKeys.length).toEqual(40);

      await redis.del(allKeys[0]);
      const afterDel = await redis.keys(globalPattern);
      expect(afterDel.length).toEqual(39);

      await redis.unlink(afterDel[0]);
      const afterUnlink = await redis.keys(globalPattern);
      expect(afterUnlink.length).toEqual(38);

      await redis.flushall();
      const afterFlush = await redis.keys(globalPattern);
      expect(afterFlush.length).toEqual(0);

      const afterFlushAll = await redis.keys("*");
      expect(afterFlushAll.length).toEqual(0);
    });
    expect.assertions(5);
  });
});
