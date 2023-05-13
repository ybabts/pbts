# Varints Explained

Varints are a method of serializing integers using one or more bytes. Smaller numbers take a smaller number of bytes.

## What are Varints?
Varints are a common encoding for variable length integer data. The high bit of each byte is used as a continuation flag: if the high bit is set, then the following byte is part of the same number. The remaining 7 bits in each byte are used as part of the number.

The main advantage of varints is the ability to use less space when storing, transmitting, or processing small numbers. This can be especially useful in systems that handle large volumes of data and need to be efficient in how they use storage or bandwidth.

## Implementations

Several different systems use varints, including:

1. Google's Protocol Buffers
2. SQLite
3. Bitcoin's transaction format
4. Apache Lucene, a search engine library

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
4. [Apache Lucene Varint](https://lucene.apache.org/core/8_0_
