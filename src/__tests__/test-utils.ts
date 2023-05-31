import RedisClient, { Redis } from "ioredis";

async function close(redis: Redis): Promise<void> {
  await redis.flushdb();
  await redis.quit();
}

function createRedisClient(db: number): Promise<Redis> {
  const redis = new RedisClient({ db, enableReadyCheck: true });
  return new Promise((resolve, reject) => {
    redis.on("ready", () => {
      resolve(redis);

      redis.flushdb().then(
        () => {
          resolve(redis);
        },
        (err) => {
          reject(err);
        }
      );
    });

    redis.on("error", () => {
      reject("cannot connect to redis");
    });
  });
}

export async function withRedis<T>(db: number, fn: (redis: Redis) => Promise<T>): Promise<T> {
  const redis = await createRedisClient(db);
  const res = await fn(redis);
  await close(redis);
  return res;
}

export function buildKeyMap(count: number, prefix: string): { [key: string]: number } {
  const map: { [key: string]: number } = {};

  for (let i = 0; i < count; i++) {
    const key = `${prefix}${i}`;
    map[key] = i;
  }

  return map;
}
