/**
 * Pure in-browser zero-dependency PKZIP binary archive packager
 */

export function createZipBlob(files) {
  const enc = new TextEncoder();
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c;
  }

  function crc32(bytes) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  const fileEntries = [];
  let localHeadersLength = 0;
  for (const f of files) {
    const nameBytes = enc.encode(f.filename);
    const dataBytes = enc.encode(f.content);
    const crc = crc32(dataBytes);
    fileEntries.push({
      nameBytes,
      dataBytes,
      crc,
      offset: localHeadersLength,
      size: dataBytes.length,
      nameLength: nameBytes.length
    });
    localHeadersLength += 30 + nameBytes.length + dataBytes.length;
  }

  let centralDirLength = 0;
  for (const e of fileEntries) {
    centralDirLength += 46 + e.nameLength;
  }

  const totalLength = localHeadersLength + centralDirLength + 22;
  const buffer = new ArrayBuffer(totalLength);
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  let pos = 0;
  // Write Local Headers + Data
  for (const e of fileEntries) {
    view.setUint32(pos, 0x04034b50, true); pos += 4;
    view.setUint16(pos, 20, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint32(pos, e.crc, true); pos += 4;
    view.setUint32(pos, e.size, true); pos += 4;
    view.setUint32(pos, e.size, true); pos += 4;
    view.setUint16(pos, e.nameLength, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    uint8.set(e.nameBytes, pos); pos += e.nameLength;
    uint8.set(e.dataBytes, pos); pos += e.size;
  }

  const centralDirStart = pos;
  // Write Central Directory Headers
  for (const e of fileEntries) {
    view.setUint32(pos, 0x02014b50, true); pos += 4;
    view.setUint16(pos, 20, true); pos += 2;
    view.setUint16(pos, 20, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint32(pos, e.crc, true); pos += 4;
    view.setUint32(pos, e.size, true); pos += 4;
    view.setUint32(pos, e.size, true); pos += 4;
    view.setUint16(pos, e.nameLength, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint32(pos, 0, true); pos += 4;
    view.setUint32(pos, e.offset, true); pos += 4;
    uint8.set(e.nameBytes, pos); pos += e.nameLength;
  }

  // Write End of Central Directory
  view.setUint32(pos, 0x06054b50, true); pos += 4;
  view.setUint16(pos, 0, true); pos += 2;
  view.setUint16(pos, 0, true); pos += 2;
  view.setUint16(pos, fileEntries.length, true); pos += 2;
  view.setUint16(pos, fileEntries.length, true); pos += 2;
  view.setUint32(pos, centralDirLength, true); pos += 4;
  view.setUint32(pos, centralDirStart, true); pos += 4;
  view.setUint16(pos, 0, true); pos += 2;

  return new Blob([buffer], { type: "application/zip" });
}
