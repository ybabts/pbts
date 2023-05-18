import { encodeVarint, decodeVarint, calculateVarintSize } from "../mod.ts";

export function encode(data: Uint8Array): Uint8Array {
  if (data.length > Number.MAX_SAFE_INTEGER) {
    throw new RangeError("Data is too long");
  }
  if (data.length === 0) throw new RangeError("Data is empty");
  const varintLength = calculateVarintSize(data.length);
  const buffer = new Uint8Array(data.length + varintLength);
  encodeVarint(buffer, data.length, 0);
  buffer.set(data, varintLength);
  return buffer;
}

export function decode(buffer: Uint8Array, offset = 0): [Uint8Array, number] {
  if (buffer.length === 0) throw new RangeError("Buffer is empty");
  if (buffer.length === 1) {
    throw new RangeError("Buffer is too short to contain a message length");
  }
  // I assume that the length of the message will never be greater than MAX_SAFE_INTEGER
  // there's no way that you'll ever need a message that's 9 petabytes long
  const result = decodeVarint(buffer, offset);
  const byteLength = typeof result === "bigint" ? Number(result & 0b1111111111n) : result & 0b111;
  const length = typeof result === "bigint" ? Number(result >> 10n) : result >> 3;
  if (buffer.length < length + byteLength) {
    throw new RangeError("Buffer is too short to contain the message");
  }
  return [buffer.subarray(byteLength + offset, byteLength + length + offset), byteLength + length];
}
