# Wire Type 2: Length-Delimited Fields

Wire type 2 in Protocol Buffers (Protobuf) is used to represent length-delimited fields. This wire type is commonly used for fields that contain strings, bytes, or embedded message types.

Length-delimited fields are encoded by prepending the field value with a varint that represents the length of the data. Varints are a variable-length encoding scheme for integers.

## Varints for the Length Field

The length field in a wire type 2 encoding uses varints to represent the length of the data. Varints are a compact and efficient way to encode integers of varying sizes.

For a detailed explanation of varints and how they work, please refer to the [Varints README](https://github.com/ybabts/pbts/tree/main/src/wires/varint) in this repository. It provides a comprehensive overview of varints and their encoding and decoding algorithms.

In summary, varints use a binary representation where the most significant bit (MSB) of each byte is a continuation flag. The remaining 7 bits of each byte are used to represent the integer value. The MSB is set to 1 for all but the last byte, indicating that there are more bytes to follow.

## Encoding Algorithm

To encode a length-delimited field with wire type 2, you can follow these steps:

1. Convert the field value into its binary representation.
2. Determine the length of the binary data.
3. Encode the length as a varint.
4. Concatenate the varint with the binary data.

The encoding algorithm ensures that the length of the field is correctly represented using varints.

## Decoding Algorithm

To decode a length-delimited field with wire type 2, you can follow these steps:

1. Read the varint from the wire.
2. Interpret the varint as the length of the following data.
3. Read the specified number of bytes as the field value.

The decoding algorithm uses the varint to determine the length of the field and extracts the corresponding number of bytes.
