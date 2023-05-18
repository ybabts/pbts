export * from "./varint/mod.ts";
export * as lengthDelimited from "./length-delimited/mod.ts";
export * from "./tag.ts";

export enum WireType {
  Varint = 0,
  Fixed64 = 1,
  LengthDelimited = 2,
  StartGroup = 3,
  EndGroup = 4,
  Fixed32 = 5,
  Reserved = 6,
}
