/**
 * Calculates the size of a varint.
 * @param value The value to calculate the size of.
 * @returns The size of the varint.
 * @throws If the value is negative.
 */
export function calcSizeNumber(value: number) {
  if (value < 0) throw new Error("Value must be positive.");
  return Math.ceil(Math.log2(value + 1) / 7);
}

/**
 * Calculates the size of a varint.
 * @param value The value to calculate the size of.
 * @returns The size of the varint.
 * @throws If the value is negative.
 */
export function calcSizeBigint(value: bigint) {
  if (value < BigInt(0)) {
    throw new Error("Value must be positive.");
  }
  return Number(
    BigInt(Math.ceil(Number((BigInt(value).toString(2).length) / 7))),
  );
}

/**
 * Calculates the size of a varint.
 * @param value The value to calculate the size of.
 * @returns The size of the varint.
 * @throws If the value is negative.
 */
export function calcSize(value: number | bigint) {
  if (typeof value === "bigint") {
    return calcSizeBigint(value);
  } else {
    return calcSizeNumber(value);
  }
}
