import { asserts } from "../../deps.ts";
import {
  decode,
  decodeBigint,
  decodeNumber,
} from "./decode.ts";
import { encode } from "./encode.ts";

Deno.test("wires/varint/decode:number > should decode correctly", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  const result = decodeNumber(bytes);
  asserts.assertEquals(result, 129);
});

Deno.test("wires/varint/decode:number > should throw if offset is out of bounds", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  asserts.assertThrows(
    () => decodeNumber(bytes, 3),
    Error,
    "Offset is out of bounds.",
  );
});

Deno.test("wires/varint/decode:number > should throw if varint is too large", () => {
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
  asserts.assertThrows(
    () => decodeNumber(bytes),
    Error,
    "Varint is too large to decode as a number.",
  );
});

Deno.test("wires/varint/decode:number > should throw if byte array is empty", () => {
  const bytes = new Uint8Array([]);
  asserts.assertThrows(
    () => decodeNumber(bytes),
    Error,
    "Cannot decode an empty array as a varint.",
  );
});

Deno.test("wires/varint/decode:bigint > should decode correctly", () => {
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
  asserts.assertEquals(result, BigInt("567382630219905"));
});

Deno.test("wires/varint/decode:bigint > should throw if offset is out of bounds", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  asserts.assertThrows(
    () => decodeBigint(bytes, 3),
    Error,
    "Offset is out of bounds.",
  );
});

Deno.test("wires/varint/decode:bigint > should throw if byte array is empty", () => {
  const bytes = new Uint8Array([]);
  asserts.assertThrows(
    () => decodeBigint(bytes),
    Error,
    "Cannot decode an empty array as a varint.",
  );
});

Deno.test("wires/varint/decode > should defer to continuationDecodeNumber if decoded value is small", () => {
  const bytes = new Uint8Array([0x81, 0x01]);
  const result = decode(bytes);
  asserts.assertEquals(result, 129);
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
  asserts.assertEquals(encodedBytes, bytes);
  asserts.assertEquals(result, 567382630219905);
});
