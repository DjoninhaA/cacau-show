import { randomBytes, scrypt, timingSafeEqual, type BinaryLike } from "node:crypto";

const KEY_LENGTH = 64;

function derive(password: string, salt: BinaryLike): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password, salt, KEY_LENGTH, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

// Stored as "salt:hash", both hex.
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const key = await derive(password, Buffer.from(salt, "hex"));
  return key.length === expected.length && timingSafeEqual(key, expected);
}
