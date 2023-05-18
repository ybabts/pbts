/**
 * Calculates the size of a varint.
 * @param value The value to calculate the size of.
 * @returns The size of the varint.
 * @throws If the value is negative.
 */
export function calculateVarintSize(value: number): number;
export function calculateVarintSize(value: bigint): number;
export function calculateVarintSize(value: number | bigint): number {
  if (value < 0) throw new Error("Value must be positive.");
  if (typeof value === "bigint") {
    return Math.ceil(value.toString(2).length / 7);
  }
  return Math.ceil(Math.log2(value + 1) / 7);
}
