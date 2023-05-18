import { assertEquals } from "../../deps.ts";
import { decodeVarint } from "./decode.ts";
import { encodeVarint } from "./encode.ts";

Deno.test("wires/varint/mod encode and decode should be reversible for numbers", () => {
  const bytes = new Uint8Array(2);
  const originalValue = 129;
  encodeVarint(bytes, originalValue);
  const decodedValue = (decodeVarint(bytes) as number) >> 3;
  assertEquals(decodedValue, originalValue);
});

Deno.test(`wires/varint/mod encode and decode should be reversible for bigints`, () => {
  const bytes = new Uint8Array(9);
  const originalValue = BigInt("9007199254740991003");
  encodeVarint(bytes, originalValue);
  const decodedValue = (decodeVarint(bytes) as bigint) >> 10n;
  assertEquals(decodedValue, originalValue);
});
