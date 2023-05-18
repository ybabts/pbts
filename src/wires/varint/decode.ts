/**
 * Decodes a varint from the given bytes. If the varint is too large to fit in a number,
 * a bigint is returned instead. The number returned is an encoded varint, so it must be
 * right shifted by 3 to get the value. To get the number of bytes read, mask the result
 * with 0x7. If the return is a bigint, shift right by 10 to get value. To get the bytes
 * read, mask with 0x3FF.
 * @param bytes The bytes to decode.
 * @param offset The offset to start reading at.
 * @returns The decoded varint. If the varint is too large to fit in a number, a bigint is returned instead.
 * @throws If the offset is negative, or if the offset is out of bounds.
 * @throws If the array is empty.
 */
export function decodeVarint(bytes: Uint8Array, offset = 0): number | bigint {
  if (offset < 0) throw new RangeError("Offset cannot be negative.");
  if (bytes.length === 0) {
    throw new Error("Cannot decode an empty array as a varint.");
  }
  if (offset >= bytes.length) throw new RangeError("Offset is out of bounds.");
  let result = 0;
  let shift = 0;
  while (bytes[offset] & 0x80) {
    if (shift > 3) {
      return decodeVarintBigint(bytes, offset, BigInt(result), BigInt(shift));
    }
    result += (bytes[offset] & 0x7F) << (shift * 7);
    shift++;
    offset++;
  }
  if (shift > 3) {
    return decodeVarintBigint(bytes, offset, BigInt(result), BigInt(shift));
  }
  result += (bytes[offset] & 0x7F) << (shift * 7);
  return (result << 3) | shift + 1;
}

export function decodeVarintBigint(
  bytes: Uint8Array,
  offset = 0,
  result = 0n,
  shift = 0n,
): bigint {
  if (offset < 0) throw new RangeError("Offset cannot be negative.");
  if (bytes.length === 0) {
    throw new Error("Cannot decode an empty array as a varint.");
  }
  if (offset >= bytes.length) throw new RangeError("Offset is out of bounds.");
  while (bytes[offset] & 0x80) {
    result += BigInt(bytes[offset] & 0x7F) << (shift * 7n);
    shift++;
    offset++;
  }
  result += BigInt(bytes[offset] & 0x7F) << (shift * 7n);
  return (result << 10n) | BigInt(shift) + 1n;
}

// TODO(ybabts) add tests for decodeVarintTuple
/**
 * Decodes a varint from the given bytes. If the varint is too large to fit in a number,
 * a bigint is returned instead. Returned as a tuple, where the first element is the
 * decoded varint, and the second element is the number of bytes read.
 * @param bytes The bytes to decode.
 * @param offset The offset to start reading at.
 * @returns The decoded varint. If the varint is too large to fit in a number, a bigint is returned instead.
 * @throws If the offset is negative, or if the offset is out of bounds.
 * @throws If the array is empty.
 * @perf performs 30.3% less operations than decodeVarint and spends 260% more time in garbage collection
 */
export function decodeVarintTuple(
  bytes: Uint8Array,
  offset = 0,
): [number | bigint, number] {
  if (offset < 0) throw new RangeError("Offset cannot be negative.");
  if (bytes.length === 0) {
    throw new Error("Cannot decode an empty array as a varint.");
  }
  if (offset >= bytes.length) throw new RangeError("Offset is out of bounds.");
  let result = 0;
  let shift = 0;
  while (bytes[offset] & 0x80) {
    if (shift > 3) {
      return decodeVarintBigintTuple(
        bytes,
        offset,
        BigInt(result),
        BigInt(shift),
      );
    }
    result += (bytes[offset] & 0x7F) << (shift * 7);
    shift++;
    offset++;
  }
  if (shift > 3) {
    return decodeVarintBigintTuple(
      bytes,
      offset,
      BigInt(result),
      BigInt(shift),
    );
  }
  result += (bytes[offset] & 0x7F) << (shift * 7);
  return [result, shift + 1];
}

export function decodeVarintBigintTuple(
  bytes: Uint8Array,
  offset = 0,
  result = 0n,
  shift = 0n,
): [bigint, number] {
  if (offset < 0) throw new RangeError("Offset cannot be negative.");
  if (bytes.length === 0) {
    throw new Error("Cannot decode an empty array as a varint.");
  }
  if (offset >= bytes.length) throw new RangeError("Offset is out of bounds.");
  while (bytes[offset] & 0x80) {
    result += BigInt(bytes[offset] & 0x7F) << (shift * 7n);
    shift++;
    offset++;
  }
  result += BigInt(bytes[offset] & 0x7F) << (shift * 7n);
  return [result, Number(shift + 1n)];
}
