interface ICallback<T> {
  (error: Error, result: T): void
}

interface EXIFData {
  orientation: number
}

export interface EXIFReadResult {
  success: boolean,
  data: EXIFData
}

export default function read(blob: Blob, cb: ICallback<EXIFReadResult>): void {
  if (blob == null) {
    throw new TypeError('Expected a blob.');
  }

  if (cb == null) {
    throw new TypeError('Expected a callback.');
  }

  cb(null, {
    success: true,
    data: { orientation: 1 }
  });
}
