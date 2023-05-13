# Varints Explained

Varints are a method of serializing integers using one or more bytes. Smaller numbers take a smaller number of bytes.

## What are Varints?
Varints are a common encoding for variable length integer data. The high bit of each byte is used as a continuation flag: if the high bit is set, then the following byte is part of the same number. The remaining 7 bits in each byte are used as part of the number.

The main advantage of varints is the ability to use less space when storing, transmitting, or processing small numbers. This can be especially useful in systems that handle large volumes of data and need to be efficient in how they use storage or bandwidth.

## Implementations

Several different systems use varints, including:

1. [Google's Protocol Buffers](https://developers.google.com/protocol-buffers/docs/encoding#varints)
2. [SQLite](https://www.sqlite.org/src/doc/trunk/src/varint.c)
3. [Bitcoin's transaction format](https://learnmeabitcoin.com/technical/varint)
4. [Apache Lucene, a search engine library]((https://lucene.apache.org/core/8_0_0/core/org/apache/lucene/store/DataInput.html#readVInt--))

Each of these has slightly different ways of encoding or decoding varints, but the basic concept is the same: use fewer bytes for smaller numbers.

## Byte Layout

The byte layout of a varint can be visualized as follows:

| Continuation Flag | Data        |
|-------------------|-------------|
| Bit 7             | Bits 6 - 0  |

The continuation flag (bit 7) is set (1) if there is more data in the next byte and cleared (0) if this byte is the last one.

## Algorithms

### Encoding

Here is a simple algorithm to encode an integer as a varint:

1. While the integer is not zero:
   1. Take the lower 7 bits of the integer.
   2. If there are more bits in the integer, set the high bit of the current output byte.
   3. Output the byte.
   4. Right shift the integer by 7 bits.

### Decoding

And here is a simple algorithm to decode a varint:

1. Start with an output of zero.
2. For each byte:
   1. Take the lower 7 bits and append them to the output.
   2. If the high bit is not set, break.
   3. Left shift the output by 7 bits.
3. The output is the decoded integer.

## Examples

For example, the number 300 would be encoded as follows:

1. In binary, 300 is `100101100`.
2. Grouped into 7-bit chunks, this is `0010010 1100`.
3. With continuation bits added, this becomes `1010010 01100`.
4. And finally, converted to hexadecimal for storage or transmission, this is `0x92 0x2C`.

Decoding `0x92 0x2C` would follow the reverse process:

1. In binary, `0x92 0x2C` is `10010010 00101100`.
2. Remove the continuation bits: `0010010 1100`.
3. Combine the 7-bit chunks: `100101100`.
4. And finally, convert to decimal to get `300`.

## Further Reading

To learn more about varints and their applications, check out the following resources:

1. [Google's Protocol Buffers](https://developers.google.com/protocol-buffers/docs/encoding#varints)
2. [SQLite Varint](https://www.sqlite.org/src/doc/trunk/src/varint.c)
3. [Bitcoin Varint](https://learnmeabitcoin.com/technical/varint)
4. [Apache Lucene Varint](https://lucene.apache.org/core/8_0_0/core/org/apache/lucene/store/DataInput.html#readVInt--)


# Code Explanation

This TypeScript code provides functions for decoding Google Protobuf Varints. Seven functions are defined: `decodeNumber`, `decodeBigint`, `decode`, `encodeNumber`, `encodeBigint`, `encode`, `calcSizeNumber`, `calcSizeBigint`, and `calcSize`.

### Function: `decodeNumber`

This function decodes a varint from the given bytes at the specified offset using MSB continuation bit encoding and returns a JavaScript number. 

The decoding process is done by iterating through each byte, masking out the 7 least significant bits, and then shifting these bits into the correct position in the result number. The loop continues until it encounters a byte where the MSB is not set, indicating the end of the varint.

The function will throw an error if the input array is empty or if the specified offset is out of bounds. It will also throw an error if the decoded varint is larger than `Number.MAX_SAFE_INTEGER`, which is the largest number that can be accurately represented in JavaScript.

### Function: `decodeBigint`

This function is similar to `decodeNumber`, but it returns a JavaScript `bigint` instead of a number. It's used for decoding varints that are too large to be accurately represented as JavaScript numbers.

The function will throw an error if the input array is empty or if the specified offset is out of bounds.

### Function: `decode`

This function decodes a varint from the given bytes at the specified offset and returns either a JavaScript number or `bigint`, depending on the size of the decoded varint.

It first scans through the bytes to determine if the varint is likely to be larger than `Number.MAX_SAFE_INTEGER`. If it appears to be larger, it delegates to `decodeBigint`; otherwise, it delegates to `decodeNumber`.

This function will throw an error if the input array is empty or if the specified offset is out of bounds.

### Function: `encodeNumber`

This function encodes a number as a varint using MSB continuation bit encoding and writes it to the provided bytes at the given offset.

The encoding process involves setting the 7 least significant bits of each byte to the 7 least significant bits of the value, then right shifting the value by 7 bits. If the value was greater than 127 (meaning there are still bits left to encode), the MSB of the byte is set to indicate that more bytes are part of this varint.

The function throws an error if the value is negative or if it's larger than `Number.MAX_SAFE_INTEGER`, which is the largest number that can be accurately represented in JavaScript.

### Function: `encodeBigint`

This function is similar to `encodeNumber`, but it encodes a JavaScript `bigint` instead of a number. It's used for encoding varints that are too large to be accurately represented as JavaScript numbers.

The function throws an error if the value is negative.

### Function: `encode`

This function encodes a number or bigint as a varint using MSB continuation bit encoding and writes it to the provided bytes at the given offset.

It delegates to `encodeBigint` if the value is a bigint, and to `encodeNumber` if the value is a number.

The function throws an error if the value is negative or if the value is a number larger than `Number.MAX_SAFE_INTEGER`.

### Function: `calcSizeNumber`

This function calculates the size of a varint that would represent the given number. It throws an error if the value is negative.

The size is calculated by adding 1 to the value (to account for zero), taking the base-2 logarithm of the result to find the number of bits required to represent the value, dividing by 7 (since each byte of a varint encodes 7 bits of the value), and rounding up to the nearest whole number (since the size must be an integer number of bytes).

### Function: `calcSizeBigint`

This function is similar to `calcSizeNumber`, but it calculates the size of a varint that would represent the given `bigint`. It throws an error if the value is negative.

The size is calculated by converting the value to a binary string, finding the length of the string (which is the number of bits required to represent the value), dividing by 7, and rounding up to the nearest whole number.

### Function: `calcSize`

This function calculates the size of a varint that would represent the given number or `bigint`.

It delegates to `calcSizeBigint` if the value is a `bigint`, and to `calcSizeNumber` if the value is a number.

The function throws an error if the value is negative.
