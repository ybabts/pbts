import { assertEquals, assertThrows } from "../../deps.ts";
import { calcSize, calcSizeBigint, calcSizeNumber } from "./calcSize.ts";

Deno.test("wires/varint/calcSize:number > Calculation Test (2 bytes)", () => {
  const varintValue = 12187;
  const expectedResult = 2;
  const actualResult = calcSizeNumber(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calcSize:number > Size Calculation Test (3 bytes)", () => {
  const varintValue = 2089467;
  const expectedResult = 3;
  const actualResult = calcSizeNumber(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calcSize:number > Size Calculation Test (5 bytes)", () => {
  const varintValue = 3000000000;
  const expectedResult = 5;
  const actualResult = calcSizeNumber(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calcSize:bigint > Calculation Test (2 bytes)", () => {
  const varintValue = 12187n;
  const expectedResult = 2;
  const actualResult = calcSizeBigint(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calcSize:bigint > Size Calculation Test (3 bytes)", () => {
  const varintValue = 2089467n;
  const expectedResult = 3;
  const actualResult = calcSizeBigint(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calcSize:bigint > Size Calculation Test (5 bytes)", () => {
  const varintValue = 3000000000n;
  const expectedResult = 5;
  const actualResult = calcSizeBigint(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calcSize > will handle large numbers", () => {
  const varintValue = BigInt(Number.MAX_SAFE_INTEGER) * BigInt(2);
  const expectedResult = 8;
  const actualResult = calcSize(varintValue);
  assertEquals(actualResult, expectedResult);
});

Deno.test("wires/varint/calcSize > will throw error on a negative number", () => {
  assertThrows(() => calcSize(-1));
});

Deno.test("wires/varint/calcSize:bigint > will throw error on a negative number", () => {
  assertThrows(() => calcSizeBigint(-1n));
});

Deno.test("wires/varint/calcSize:number > will throw error on a negative number", () => {
  assertThrows(() => calcSizeNumber(-1));
});
