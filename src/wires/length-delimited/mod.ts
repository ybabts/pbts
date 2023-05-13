import { varint } from '../mod.ts';

export function encode(data: Uint8Array): Uint8Array {
  if(data.length > Number.MAX_SAFE_INTEGER) throw new RangeError('Data is too long');
  if(data.length === 0) throw new RangeError('Data is empty');
  const varintLength = varint.calcSize(data.length);
  const buffer = new Uint8Array(data.length + varintLength);
  varint.encode(buffer, data.length, 0);
  buffer.set(data, varintLength);
  return buffer;
}

export function decode(buffer: Uint8Array): Uint8Array {
  if(buffer.length === 0) throw new RangeError('Buffer is empty');
  if(buffer.length === 1) throw new RangeError('Buffer is too short to contain a message length');
  // I assume that the length of the message will never be greater than MAX_SAFE_INTEGER
  // there's no way that you'll ever need a message that's 9 petabytes long
  const length = varint.decodeNumber(buffer, 0);
  const bufferLength = varint.calcSize(length);
  if(buffer.length < length + bufferLength) throw new RangeError('Buffer is too short to contain the message');
  return buffer.subarray(bufferLength, bufferLength + length);
}