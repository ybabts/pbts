
/**
 * Encodes a number as a varint using MSB continuation bit encoding and writes it to the given bytes at the given offset.
 * @param bytes The bytes to write the encoded varint to.
 * @param value The value to encode.
 * @param offset The offset to start writing at.
 * @returns Nothing.
 * @throws If the value is too large to encode as a number.
 */
export function encodeNumber(bytes: Uint8Array, value: number, offset = 0): void {
  if(value < 0) throw new Error('Value is negative.');
  if (value > Number.MAX_SAFE_INTEGER) {
    throw new Error('Value is too large to encode as a number.');
  }
  do {
    bytes[offset] = value & 0x7F;
    if (value > 0x7F) bytes[offset] |= 0x80;
    value = Math.floor(value / 128);
    offset++;
  } while (value !== 0);
}

/**
 * Encodes a bigint as a varint using MSB continuation bit encoding and writes it to the given bytes at the given offset.
 * @param bytes The bytes to write the encoded varint to.
 * @param value The value to encode.
 * @param offset The offset to start writing at.
 * @returns Nothing.
 * @throws If the value is negative.
 */
export function encodeBigint(bytes: Uint8Array, value: bigint, offset = 0): void {
  if(value < 0) throw new Error('Value is negative.');
  do {
    bytes[offset] = Number(value & BigInt(0x7F));
    if (value > BigInt(0x7F)) bytes[offset] |= 0x80;
    value = value / BigInt(128);
    offset++;
  } while (value !== BigInt(0));
}

/**
 * Encodes a number or bigint as a varint using MSB continuation bit encoding and writes it to the given bytes at the given offset. If the value is a number, defers to encodeNumber. If the value is a bigint, defers to encodeBigint.
 * @param bytes The bytes to write the encoded varint to.
 * @param value The value to encode.
 * @param offset The offset to start writing at.
 * @returns Nothing.
 * @throws If the value is negative.
 * @throws If the value is too large to encode as a number.
 */
export function encode(bytes: Uint8Array, value: number | bigint, offset = 0): void {
  if (typeof value === 'bigint') {
    encodeBigint(bytes, value, offset);
  } else {
    encodeNumber(bytes, value, offset);
  }
}