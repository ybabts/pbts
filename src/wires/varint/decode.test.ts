import { assertEquals, assertThrows } from "../../deps.ts";
import { decodeVarint } from "./decode.ts";

Deno.test("wires/varint/decodeVarint should throw on negative offset", () => {
  const bytes = new Uint8Array([0x00, 0x81, 0x81, 0x81, 0x81, 0x81, 0x01]);
  assertThrows(
    () => decodeVarint(bytes, -1),
    RangeError,
    "Offset cannot be negative.",
  );
});

Deno.test("wires/varint/decodeVarint should throw on offset out of bounds", () => {
  const bytes = new Uint8Array([0x00, 0x81, 0x81, 0x81, 0x81, 0x81, 0x01]);
  assertThrows(
    () => decodeVarint(bytes, 7),
    RangeError,
    "Offset is out of bounds.",
  );
});

Deno.test("wires/varint/decodeVarint should throw on empty array", () => {
  const bytes = new Uint8Array([]);
  assertThrows(
    () => decodeVarint(bytes),
    Error,
    "Cannot decode an empty array as a varint.",
  );
});

Deno.test("wires/varint/decodeVarint should decode 1 byte correctly", () => {
  const bytes = new Uint8Array([0x01]); // 0000 0001
  const result = (decodeVarint(bytes) as number) >> 3;
  assertEquals(result, 1);
});

Deno.test("wires/varint/decodeVarint should decode 2 bytes correctly", () => {
  const bytes = new Uint8Array([0x81, 0x01]); // 1000 0001 0000 0001
  const result = (decodeVarint(bytes) as number) >> 3;
  assertEquals(result, 129);
});

Deno.test("wires/varint/decodeVarint should decode 3 bytes correctly", () => {
  const bytes = new Uint8Array([0x81, 0x81, 0x01]); // 1000 0001 1000 0001 0000 0001
  const result = (decodeVarint(bytes) as number) >> 3;
  assertEquals(result, 16513);
});

Deno.test("wires/varint/decodeVarint should decode 4 bytes correctly", () => {
  const bytes = new Uint8Array([0x81, 0x81, 0x81, 0x01]); // 1000 0001 1000 0001 1000 0001 0000 0001
  const result = (decodeVarint(bytes) as number) >> 3;
  assertEquals(result, 2113665);
});

Deno.test("wires/varint/decodeVarint should decode 5 bytes correctly", () => {
  const bytes = new Uint8Array([0x81, 0x81, 0x81, 0x81, 0x01]); // 1000 0001 1000 0001 1000 0001 1000 0001 0000 0001
  const result = (decodeVarint(bytes) as bigint) >> 10n;
  assertEquals(result, 270549121n);
});

Deno.test("wires/varint/decodeVarint should decode 6 bytes correctly", () => {
  const bytes = new Uint8Array([0x81, 0x81, 0x81, 0x81, 0x81, 0x01]); // 1000 0001 1000 0001 1000 0001 1000 0001 1000 0001 0000 0001
  const result = (decodeVarint(bytes) as bigint) >> 10n;
  assertEquals(result, 34630287489n);
});

Deno.test("wires/varint/decodeVarint should decode 6 bytes with an offset of 1", () => {
  const bytes = new Uint8Array([0x00, 0x81, 0x81, 0x81, 0x81, 0x81, 0x01]); // 0000 0000 1000 0001 1000 0001 1000 0001 1000 0001 1000 0001 0000 0001
  const result = (decodeVarint(bytes, 1) as bigint) >> 10n;
  assertEquals(result, 34630287489n);
});

Deno.test("wires/varint/decodeVarint should decode 7 bytes with an offset of 2", () => {
  const bytes = new Uint8Array([
    0x00,
    0x00,
    0x81,
    0x81,
    0x81,
    0x81,
    0x81,
    0x01,
  ]); // 0000 0000 0000 0000 1000 0001 1000 0001 1000 0001 1000 0001 1000 0001 0000 0001
  const result = (decodeVarint(bytes, 2) as bigint) >> 10n;
  assertEquals(result, 34630287489n);
});

Deno.test("wires/varint/decodeVarint should return a bigint if longer than 4 bytes", () => {
  const bytes = new Uint8Array([0x81, 0x81, 0x81, 0x81, 0x81, 0x01]);
  const result = decodeVarint(bytes);
  assertEquals(typeof result, "bigint");
});

Deno.test("wires/varint/decodeVarint should return a number if 4 bytes or shorter", () => {
  const bytes = new Uint8Array([0x81, 0x81, 0x81, 0x01]);
  const result = decodeVarint(bytes);
  assertEquals(typeof result, "number");
});