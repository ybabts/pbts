import { asserts } from "../../deps.ts";
import { encodeNumber, encodeBigint, encode } from "./encode.ts";

Deno.test("wires/varint/encode:number > should encode correctly", () => {
  const bytes = new Uint8Array(2);
  encodeNumber(bytes, 129);
  asserts.assertEquals(bytes, new Uint8Array([0x81, 0x01])); // Represents 129
});

Deno.test("wires/varint/encode:number > should throw if value is too large", () => {
  const bytes = new Uint8Array(2);
  asserts.assertThrows(() => encodeNumber(bytes, Number.MAX_SAFE_INTEGER + 1), Error, 'Value is too large to encode as a number.');
});

Deno.test("wires/varint/encode:bigint > should encode correctly", () => {
  const bytes = new Uint8Array(2);
  encodeBigint(bytes, BigInt(129));
  asserts.assertEquals(bytes, new Uint8Array([0x81, 0x01])); // Represents 129
});

Deno.test("wires/varint/encode > should defer to continuationEncodeNumber if value is a number", () => {
  const bytes = new Uint8Array(2);
  encode(bytes, 129);
  asserts.assertEquals(bytes, new Uint8Array([0x81, 0x01])); // Represents 129
});

Deno.test("wires/varint/encode > should defer to continuationEncodeBigInt if value is a bigint", () => {
  const bytes = new Uint8Array(2);
  encode(bytes, BigInt(129));
  asserts.assertEquals(bytes, new Uint8Array([0x81, 0x01])); // Represents 129
});

Deno.test("wires/varint/encode:number > should throw if value is negative", () => {
  const bytes = new Uint8Array(2);
  asserts.assertThrows(() => encodeNumber(bytes, -1), Error, 'Value is negative.');
});

Deno.test("wires/varint/encode:bigint > should throw if value is negative", () => {
  const bytes = new Uint8Array(2);
  asserts.assertThrows(() => encodeBigint(bytes, BigInt(-1)), Error, 'Value is negative.');
});

Deno.test("wires/varint/encode > should throw if value is negative", () => {
  const bytes = new Uint8Array(2);
  asserts.assertThrows(() => encode(bytes, -1), Error, 'Value is negative.');
  asserts.assertThrows(() => encode(bytes, BigInt(-1)), Error, 'Value is negative.');
});