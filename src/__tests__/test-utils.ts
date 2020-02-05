import RedisClient, { Redis } from "ioredis";

function debug(..._args: any[]): void {
  // for some reason console.xxx methods make some tests fail ??????
  //console.debug(...args);
}

async function close(db: number, redis: Redis): Promise<void> {
  debug(`[REDIS db ${db}] final flushdb...`);
  return redis
    .flushdb()
    .then(res => debug(`[REDIS db ${db}] flushed! ${res}`))
    .finally(() => {
      debug(`[REDIS db ${db}] quitting...`);
      return redis.quit().then(() => {
        debug(`[REDIS db ${db}] quit OK`);
      });
    });
}

function createRedisClient(db: number): Promise<Redis> {
  const redis = new RedisClient({ db, enableReadyCheck: true });
  return new Promise((resolve, reject) => {
    redis.on("ready", () => {
      resolve(redis);
      debug(`[REDIS db ${db}] CONNECTED. Initial flushdb...`);

      redis.flushdb().then(
        () => {
          debug(`[REDIS db ${db}] Initial flushdb done`);
          resolve(redis);
        },
        err => {
          console.error(`[REDIS db ${db}] FAILED TO DO INITIAL FLUSHDB`, err);
          reject("failed to ");
        }
      );
    });

    redis.on("error", () => {
      reject("cannot connect to redis");
    });
  });
}

export async function withRedis<T>(
  db: number,
  fn: (redis: Redis) => Promise<T>
): Promise<T> {
  const redis = await createRedisClient(db);
  return fn(redis).finally(() => close(db, redis));
}

export function buildKeyMap(
  count: number,
  prefix: string
): { [key: string]: number } {
  const map: { [key: string]: number } = {};

  for (let i = 0; i < count; i++) {
    const key = `${prefix}${i}`;
    map[key] = i;
  }

  return map;
}
