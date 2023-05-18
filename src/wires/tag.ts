import { WireType } from "./mod.ts";

export function encodeTag(fieldNumber: number, wireType: WireType): number {
  return (fieldNumber << 3) | wireType;
}

export function decodeTag(tag: number): [number, WireType] {
  return [tag >> 3, tag & 7];
}
