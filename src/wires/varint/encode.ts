/**
 * Encodes a number or bigint as a varint using MSB continuation bit encoding and writes it to the given bytes at the given offset.
 * @param bytes The bytes to write the encoded varint to.
 * @param value The value to encode.
 * @param offset The offset to start writing at.
 * @returns The offset after writing the encoded varint.
 * @throws If the value is negative.
 */
export function encodeVarint(
  bytes: Uint8Array,
  value: number,
  offset?: number,
): number;
export function encodeVarint(
  bytes: Uint8Array,
  value: bigint,
  offset?: number,
): number;
export function encodeVarint(
  bytes: Uint8Array,
  value: number | bigint,
  offset = 0,
): number {
  if (value < 0) throw new Error("Value is negative.");
  if (offset < 0) throw new Error("Offset is negative.");
  if (typeof value === "number") {
    do {
      bytes[offset] = value & 0x7F;
      if (value > 0x7F) bytes[offset] |= 0x80;
      value = Math.floor(value / 128);
      offset++;
    } while (value !== 0);
  } else {do {
      bytes[offset] = Number(value & 0x7Fn);
      if (value > 0x7Fn) bytes[offset] |= 0x80;
      value = value / 128n;
      offset++;
    } while (value !== 0n);}
  return offset;
}
