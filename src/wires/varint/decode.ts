/**
 * Decodes a varint from the given bytes at the given offset using MSB continuation bit encoding.
 * @param bytes The bytes to decode.
 * @param offset The offset to start decoding at.
 * @returns A tuuple containing the decoded varint and the number of bytes read.
 * @throws If the byte array length is 0
 * @throws If the offset is out of bounds
 */
export function decodeNumber(
  bytes: Uint8Array,
  offset = 0,
): [number, number] {
  if (bytes.length === 0) {
    throw new Error("Cannot decode an empty array as a varint.");
  }
  if (offset >= bytes.length) throw new RangeError("Offset is out of bounds.");
  if (offset < 0) throw new RangeError("Offset cannot be negative.");
  let result = 0;
  let shift = 0;
  do {
    result += (bytes[offset] & 0x7F) * (2 ** (shift * 7));
    shift++;
  } while ((bytes[offset++] & 0x80) !== 0);
  if (result > Number.MAX_SAFE_INTEGER) {
    throw new Error("Varint is too large to decode as a number.");
  }
  return [result, shift];
}

/**
 * Decodes a varint from the given bytes at the given offset using MSB continuation bit encoding.
 * @param bytes The bytes to decode.
 * @param offset The offset to start decoding at.
 * @returns A tuuple containing the decoded varint and the number of bytes read.
 * @throws If the byte array length is 0
 * @throws If the offset is out of bounds
 */
export function decodeBigint(
  bytes: Uint8Array,
  offset = 0,
): [bigint, number] {
  if (bytes.length === 0) {
    throw new Error("Cannot decode an empty array as a varint.");
  }
  if (offset >= bytes.length) throw new RangeError("Offset is out of bounds.");
  if (offset < 0) throw new RangeError("Offset cannot be negative.");
  let result = BigInt(0);
  let shift = BigInt(0);
  do {
    result += BigInt(bytes[offset] & 0x7F) * (BigInt(2) ** (shift * BigInt(7)));
    shift++;
  } while ((bytes[offset++] & 0x80) !== 0);
  return [result, Number(shift)];
}

/**
 * Decodes a varint from the given bytes at the given offset using MSB continuation bit encoding. Defers to continuationDecodeNumber if the decoded value is less than or equal to the maximum safe integer. Otherwise, defers to continuationDecodeBigInt.
 * @param bytes The bytes to decode. Must be at least 1 byte long.
 * @param offset The offset to start decoding at. Defaults to 0.
 * @returns A tuuple containing the decoded varint and the number of bytes read. If the decoded value is larger than the maximum safe integer, it will be returned as a bigint.
 * @throws If the byte array length is 0
 * @throws If the offset is out of bounds
 */
export function decode(
  bytes: Uint8Array,
  offset = 0,
): [number | bigint, number] {
  let i;
  for (i = offset; i < bytes.length && i - offset <= 7; i++) {
    if (bytes[i] <= 0x7F) break;
  }
  return i - offset > 7
    ? decodeBigint(bytes, offset)
    : decodeNumber(bytes, offset);
}