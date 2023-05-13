import { assertEquals, assertThrows } from "../../deps.ts";
import { decode, decodeBigint, decodeNumber } from "./decode.ts";
import { encode } from "./encode.ts";

Deno.test("wires/varint/decodeNumber > should decode correctly", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  const result = decodeNumber(bytes);
  assertEquals(result, 129);
});

Deno.test("wires/varint/decodeNumber > should throw if offset is out of bounds", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  assertThrows(
    () => decodeNumber(bytes, 3),
    RangeError,
    "Offset is out of bounds.",
  );
});

Deno.test("wires/varint/decodeNumber > should throw if varint is too large", () => {
  const bytes = new Uint8Array([
    0xFF,
    0xFF,
    0xFF,
    0xFF,
    0xFF,
    0xFF,
    0xFF,
    0xFF,
    0x7F,
  ]);
  assertThrows(
    () => decodeNumber(bytes),
    Error,
    "Varint is too large to decode as a number.",
  );
});

Deno.test("wires/varint/decodeNumber > should throw if byte array is empty", () => {
  const bytes = new Uint8Array([]);
  assertThrows(
    () => decodeNumber(bytes),
    Error,
    "Cannot decode an empty array as a varint.",
  );
});

Deno.test("wires/varint/decodeNumber > should throw if offset is negative", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  assertThrows(
    () => decodeNumber(bytes, -1),
    RangeError,
    "Offset cannot be negative.",
  );
});

Deno.test("wires/varint/decodeBigint > should decode correctly", () => {
  const bytes = new Uint8Array([
    0x81,
    0x81,
    0x81,
    0x81,
    0x81,
    0x81,
    0x81,
    0x01,
  ]);
  const result = decodeBigint(bytes);
  assertEquals(result, BigInt("567382630219905"));
});

Deno.test("wires/varint/decodeBigint > should throw if offset is out of bounds", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  assertThrows(
    () => decodeBigint(bytes, 3),
    RangeError,
    "Offset is out of bounds.",
  );
});

Deno.test("wires/varint/decodeBigint > should throw if byte array is empty", () => {
  const bytes = new Uint8Array([]);
  assertThrows(
    () => decodeBigint(bytes),
    Error,
    "Cannot decode an empty array as a varint.",
  );
});


Deno.test("wires/varint/decodeBigint > should throw if offset is negative", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  assertThrows(
    () => decodeBigint(bytes, -1),
    RangeError,
    "Offset cannot be negative.",
  );
});

Deno.test("wires/varint/decode > should defer to continuationDecodeNumber if decoded value is small", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  const result = decode(bytes);
  assertEquals(result, 129);
});

Deno.test("wires/varint/decode > should defer to continuationDecodeBigInt if decoded value is large", () => {
  const bytes = new Uint8Array([
    0x81,
    0x81,
    0x81,
    0x81,
    0x81,
    0x81,
    0x81,
    0x01,
  ]);
  const encodedBytes = new Uint8Array(8);
  const result = decode(bytes);
  encode(encodedBytes, result);
  assertEquals(encodedBytes, bytes);
  assertEquals(result, 567382630219905);
});

Deno.test("wires/varint/decode > should throw if byte array is empty", () => {
  const bytes = new Uint8Array([]);
  assertThrows(
    () => decode(bytes),
    Error,
    "Cannot decode an empty array as a varint.",
  );
});

Deno.test("wires/varint/decode > should throw if offset is out of bounds", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  assertThrows(
    () => decode(bytes, 3),
    RangeError,
    "Offset is out of bounds.",
  );
});

Deno.test("wires/varint/decode > should throw if offset is negative", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  assertThrows(
    () => decode(bytes, -1),
    RangeError,
    "Offset cannot be negative.",
  );
});