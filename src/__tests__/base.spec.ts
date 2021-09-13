import { v4 as uuidv4 } from "uuid";
import { buildKeyMap, withRedis } from "./test-utils";

describe("travis redis", () => {
  it("flushall, del, unlink, mset and keys work", async () => {
    const prefix = uuidv4();
    const globalPattern = `${prefix}*`;

    await withRedis(0, async (redis) => {
      await redis.flushall();
      await redis.mset(buildKeyMap(400, prefix));

      const allKeys = await redis.keys(globalPattern);
      expect(allKeys.length).toEqual(400);

      await redis.del(allKeys[0]);
      const afterDel = await redis.keys(globalPattern);
      expect(afterDel.length).toEqual(399);

      await redis.unlink(afterDel[0]);
      const afterUnlink = await redis.keys(globalPattern);
      expect(afterUnlink.length).toEqual(398);

      await redis.flushall();
      const afterFlush = await redis.keys(globalPattern);
      expect(afterFlush.length).toEqual(0);

      const afterFlushAll = await redis.keys("*");
      expect(afterFlushAll.length).toEqual(0);
    });
    expect.assertions(5);
  });
});
