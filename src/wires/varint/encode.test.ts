import { assertEquals, assertThrows } from "../../deps.ts";
import { encodeVarint } from "./encode.ts";

Deno.test("wires/varint/encode should throw if value is negative", () => {
  const bytes = new Uint8Array(2);
  assertThrows(() => encodeVarint(bytes, -1), Error, "Value is negative.");
  assertThrows(
    () => encodeVarint(bytes, BigInt(-1)),
    Error,
    "Value is negative.",
  );
});

Deno.test("wires/varint/encode should throw if offset is negative", () => {
  const bytes = new Uint8Array(2);
  assertThrows(() => encodeVarint(bytes, 1, -1), Error, "Offset is negative.");
});

Deno.test("wires/varint/encode should encode 1 byte correctly", () => {
  const bytes = new Uint8Array(1);
  encodeVarint(bytes, 0x01);
  assertEquals(bytes, new Uint8Array([0x01])); // Represents 1
});

Deno.test("wires/varint/encode should encode 2 bytes correctly", () => {
  const bytes = new Uint8Array(2);
  encodeVarint(bytes, 0x80);
  assertEquals(bytes, new Uint8Array([0x80, 0x01])); // Represents 128
});

Deno.test("wires/varint/encode should encode 3 bytes correctly", () => {
  const bytes = new Uint8Array(3);
  encodeVarint(bytes, 0x4000);
  assertEquals(bytes, new Uint8Array([0x80, 0x80, 0x01])); // Represents 16384
});

Deno.test("wires/varint/encode should encode 4 bytes correctly", () => {
  const bytes = new Uint8Array(4);
  encodeVarint(bytes, 0x200000);
  assertEquals(bytes, new Uint8Array([0x80, 0x80, 0x80, 0x01])); // Represents 2097152
});

Deno.test("wires/varint/encode should encode 5 bytes correctly", () => {
  const bytes = new Uint8Array(5);
  encodeVarint(bytes, 0x10000000);
  assertEquals(
    bytes,
    new Uint8Array([0x80, 0x80, 0x80, 0x80, 0x01]),
  ); // Represents 268435456
});

Deno.test("wires/varint/encode should encode 6 bytes correctly", () => {
  const bytes = new Uint8Array(6);
  encodeVarint(bytes, 0x800000000);
  assertEquals(
    bytes,
    new Uint8Array([0x80, 0x80, 0x80, 0x80, 0x80, 0x01]),
  ); // Represents 34359738368
});

Deno.test("wires/varint/encode should encode 4 bytes correctly with an offset of 2", () => {
  const bytes = new Uint8Array(6);
  encodeVarint(bytes, 0x200000, 2);
  assertEquals(
    bytes,
    new Uint8Array([0x00, 0x00, 0x80, 0x80, 0x80, 0x01]),
  ); // Represents 2097152
});

Deno.test("wires/varint/encode should encode 3 bytes correctly with an offset of 4", () => {
  const bytes = new Uint8Array(7);
  encodeVarint(bytes, 0x4000, 4);
  assertEquals(
    bytes,
    new Uint8Array([0, 0, 0, 0, 0x80, 0x80, 0x01]),
  ); // Represents 16384
});

Deno.test("wires/varint/encode should work if value is a number", () => {
  const bytes = new Uint8Array(2);
  encodeVarint(bytes, 129);
  assertEquals(bytes, new Uint8Array([0x81, 0x01])); // Represents 129
});

Deno.test("wires/varint/encode should work if value is a bigint", () => {
  const bytes = new Uint8Array(2);
  encodeVarint(bytes, BigInt(129));
  assertEquals(bytes, new Uint8Array([0x81, 0x01])); // Represents 129
});
