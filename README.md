# PBTS - Protobuf Typescript

PBTS (Protobuf Typescript) is a personal project aimed at providing a CLI and library for working with Protobufs in TypeScript using Deno. It offers functionality to compile .proto files into TypeScript code, allowing for easy import and usage. Additionally, it provides functions to parse Protobuf files and perform on-the-fly serialization and deserialization of messages.

## Features

- Compile .proto files to TypeScript code
- Import and use generated TypeScript code
- Parse Protobuf files
- Serialize and deserialize messages

## Installation

Ensure you have Deno installed on your system. Visit [deno.land](https://deno.land) for installation instructions.

## Usage

### CLI

To compile a .proto file to TypeScript:

```shell
deno run --unstable -A https://pbts.deno.dev compile path/to/your/proto.proto
```

## Library
To use PBTS as a library in your Deno project, import it from a URL:

```ts
import { parseProto, serialize, deserialize } from 'something something';

// Parse a Protobuf file
const parsedProto = parseProto('path/to/your/proto.proto');

// Serialize a message
const serializedMessage = serialize(parsedProto, yourMessageObject);

// Deserialize a message
const deserializedMessage = deserialize(parsedProto, serializedMessage);
```

## Contributing
Contributions are welcome! If you encounter any issues, have suggestions, or would like to contribute to the project, please feel free to submit a pull request or open an issue on the GitHub repository.

## License
This project is licensed under the MIT License.
