import { customAlphabet, customRandom } from "nanoid";

export function genID(len: number = 10) {
  const nanoid = customAlphabet("1234567890abcdef", 10);
  return nanoid(len);
}
