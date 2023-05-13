import { assertEquals } from "../../deps.ts";
import { decode, decodeBigint, decodeNumber } from "./decode.ts";
import { encode, encodeBigint, encodeNumber } from "./encode.ts";

Deno.test("wires/varint/mod encodeNumber and decodeNumber should be reversible", () => {
  const bytes = new Uint8Array(2);
  const originalValue = 129;
  encodeNumber(bytes, originalValue);
  const decodedValue = decodeNumber(bytes);
  assertEquals(decodedValue, originalValue);
});

Deno.test("wires/varint/mod encodeBigint and decodeBigint should be reversible", () => {
  const bytes = new Uint8Array(2);
  const originalValue = BigInt(129);
  encodeBigint(bytes, originalValue);
  const decodedValue = decodeBigint(bytes);
  assertEquals(decodedValue, originalValue);
});

Deno.test("wires/varint/mod encode and decode should be reversible for numbers", () => {
  const bytes = new Uint8Array(2);
  const originalValue = 129;
  encode(bytes, originalValue);
  const decodedValue = decode(bytes);
  assertEquals(decodedValue, originalValue);
});

Deno.test(`wires/varint/mod encode and decode should be reversible for bigints`, () => {
  const bytes = new Uint8Array(9);
  const originalValue = BigInt("9007199254740991003");
  encode(bytes, originalValue);
  const decodedValue = decode(bytes);
  assertEquals(decodedValue, originalValue);
});
