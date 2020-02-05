import RedisClient, { Redis } from "ioredis";

export function redisClient(): Redis {
  return new RedisClient();
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
