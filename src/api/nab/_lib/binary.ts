/**
 * 바이패스 계층이 망가뜨린 바이너리 응답을 되살린다.
 *
 * NAB 서버는 엑셀을 `Content-Type: application/octet-stream;charset=UTF-8` 로 내려준다.
 * 바이너리에 charset 이 붙어 있어서, 앞단 게이트웨이가 본문을 텍스트로 보고
 * ISO-8859-1 → UTF-8 로 다시 인코딩해 버린다. 파일은 깨지고 용량이 약 1.4 배가 된다
 * (0x80 이상 바이트가 전부 2바이트로 늘어난다).
 *
 * 이 변환은 정보 손실이 없어 되돌릴 수 있다 — UTF-8 로 디코드한 뒤 코드포인트를
 * 그대로 바이트로 환원하면 원본과 바이트 단위로 같아진다.
 *
 * 근본 해결은 서버에서 charset 을 빼거나 바이패스 계층이 본문을 건드리지 않게 하는 것이다.
 * 그때가 오면 아래 판정이 전부 실패해 원본을 그대로 돌려주므로, 이 보정은 저절로 꺼진다.
 */

/** ZIP 로컬 헤더 (xlsx·docx) */
const ZIP_LOCAL_HEADER = [0x50, 0x4b, 0x03, 0x04];
/** ZIP 중앙 디렉터리 끝 레코드 — 정상 zip 이면 꼬리에 반드시 있다 */
const ZIP_END_OF_CENTRAL_DIR = [0x50, 0x4b, 0x05, 0x06];
/** PDF 서명 */
const PDF_HEADER = [0x25, 0x50, 0x44, 0x46];

/** EOCD 는 주석 길이(최대 65535) + 레코드 22바이트 안에 들어간다 */
const ZIP_TAIL_SCAN_SIZE = 65_557;

const startsWith = (bytes: Uint8Array, signature: number[]): boolean =>
  signature.every((byte, i) => bytes[i] === byte);

const includesAt = (bytes: Uint8Array, signature: number[], from: number): boolean => {
  for (let i = from; i <= bytes.length - signature.length; i += 1) {
    if (startsWith(bytes.subarray(i), signature)) {
      return true;
    }
  }

  return false;
};

/** 되살린 결과가 진짜 파일인지 구조로 확인한다 — 여기서 걸러야 오탐이 없다 */
const looksLikeRealFile = (bytes: Uint8Array): boolean => {
  if (startsWith(bytes, PDF_HEADER)) {
    return true;
  }

  if (!startsWith(bytes, ZIP_LOCAL_HEADER)) {
    return false;
  }

  const from = Math.max(0, bytes.length - ZIP_TAIL_SCAN_SIZE);

  return includesAt(bytes, ZIP_END_OF_CENTRAL_DIR, from);
};

/**
 * ISO-8859-1 → UTF-8 로 재인코딩된 바이너리를 원래 바이트로 되돌린다.
 * 손상되지 않았거나 이 방식의 손상이 아니면 받은 Blob 을 그대로 돌려준다.
 */
export const repairMangledBinary = async (blob: Blob): Promise<Blob> => {
  const original = new Uint8Array(await blob.arrayBuffer());

  let decoded: string;
  try {
    // 정상 바이너리는 거의 확실히 유효한 UTF-8 이 아니라 여기서 걸러진다
    decoded = new TextDecoder('utf-8', { fatal: true }).decode(original);
  } catch {
    return blob;
  }

  const repaired = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i += 1) {
    const code = decoded.charCodeAt(i);

    // latin-1 왕복이었다면 모든 코드포인트가 한 바이트에 들어간다
    if (code > 0xff) {
      return blob;
    }

    repaired[i] = code;
  }

  // 길이가 그대로면 손상이 아니다 (순수 ASCII 본문 등)
  if (repaired.length === original.length || !looksLikeRealFile(repaired)) {
    return blob;
  }

  return new Blob([repaired], { type: blob.type });
};
