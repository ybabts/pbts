import { decode, encode } from "./mod.ts";
import { assertEquals, assertThrows } from "../../deps.ts";

Deno.test("wires/length-delimited/encode > Encode length-delimited field", () => {
  const data = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
  const expectedBuffer = new Uint8Array([5, 72, 101, 108, 108, 111]);

  const encodedBuffer = encode(data);

  assertEquals(encodedBuffer, expectedBuffer);
});

Deno.test("wires/length-delimited/encode > Encode empty data throws error", () => {
  const emptyData = new Uint8Array(0);
  assertThrows(
    () => {
      encode(emptyData);
    },
    RangeError,
    "Data is empty",
  );
});

Deno.test("wires/length-delimited/encode > Encode too long data throws error", () => {
  // you can't allocated more than 2^53 bytes in a single buffer
  // so this is the maximum length of a message
  assertThrows(() => {
    new Uint8Array(Number.MAX_SAFE_INTEGER + 1);
  }, RangeError);
});

Deno.test("wires/length-delimited/decode > Decode length-delimited field", () => {
  const encodedBuffer = new Uint8Array([5, 72, 101, 108, 108, 111]);
  const expectedData = new Uint8Array([72, 101, 108, 108, 111]);

  const decodedData = decode(encodedBuffer);

  assertEquals(decodedData, expectedData);
});

Deno.test("wires/length-delimited/decode > Decode empty buffer throws error", () => {
  const emptyBuffer = new Uint8Array(0);
  assertThrows(
    () => {
      decode(emptyBuffer);
    },
    RangeError,
    "Buffer is empty",
  );
});

Deno.test("wires/length-delimited/decode > Decode buffer too short throws error", () => {
  const shortBuffer = new Uint8Array([5]); // Missing length bytes
  assertThrows(
    () => {
      decode(shortBuffer);
    },
    RangeError,
    "Buffer is too short to contain a message length",
  );
});

Deno.test("wires/length-delimited/decode > Decode buffer too short to contain message throws error", () => {
  const encodedBuffer = new Uint8Array([5, 72, 101, 108, 108, 111]);
  // Remove some bytes from the end of the buffer to make it shorter than the expected message length
  const shortBuffer = encodedBuffer.subarray(0, encodedBuffer.length - 2);

  assertThrows(
    () => {
      decode(shortBuffer);
    },
    RangeError,
    "Buffer is too short to contain the message",
  );
});
