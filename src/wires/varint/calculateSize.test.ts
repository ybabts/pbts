import { assertEquals, assertThrows } from "../../deps.ts";
import { calculateVarintSize } from "./calculateSize.ts";

Deno.test("wires/varint/calculateSize will calculate 2 byte number", () => {
  const varintValue = 12187;
  const expectedResult = 2;
  const actualResult = calculateVarintSize(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calculateSize will calculate 3 byte number", () => {
  const varintValue = 2089467;
  const expectedResult = 3;
  const actualResult = calculateVarintSize(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calculateSize will calculate 5 byte number", () => {
  const varintValue = 3000000000;
  const expectedResult = 5;
  const actualResult = calculateVarintSize(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calculateSize will calculate 2 byte bigint", () => {
  const varintValue = 12187n;
  const expectedResult = 2;
  const actualResult = calculateVarintSize(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calculateSize will calculate 3 byte bigint", () => {
  const varintValue = 2089467n;
  const expectedResult = 3;
  const actualResult = calculateVarintSize(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calculateSize will calculate 5 byte bigint", () => {
  const varintValue = 3000000000n;
  const expectedResult = 5;
  const actualResult = calculateVarintSize(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calculateSize will handle large numbers", () => {
  const varintValue = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2);
  const expectedResult = 8;
  const actualResult = calculateVarintSize(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calculateSize will throw error on a negative number", () => {
  assertThrows(() => calculateVarintSize(-1));
});

Deno.test("wires/varint/calculateSize will throw error on a negative bigint", () => {
  assertThrows(() => calculateVarintSize(-1n));
});