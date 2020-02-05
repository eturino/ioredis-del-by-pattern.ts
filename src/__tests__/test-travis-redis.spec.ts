import { buildKeyMap, redisClient } from "./test-utils";

describe("travis redis", () => {
  it("flushall, del, unlink, mset and keys work", async () => {
    const redis = redisClient();
    await redis.flushall();

    await redis.mset(buildKeyMap(400, "testing-travis"));

    const allKeys = await redis.keys("*");
    expect(allKeys.length).toEqual(400);

    await redis.del(allKeys[0]);
    const afterDel = await redis.keys("*");
    expect(afterDel.length).toEqual(399);

    await redis.unlink(afterDel[0]);
    const afterUnlink = await redis.keys("*");
    expect(afterUnlink.length).toEqual(398);

    await redis.flushall();
    const afterFlush = await redis.keys("*");
    expect(afterFlush.length).toEqual(0);
  });
});
