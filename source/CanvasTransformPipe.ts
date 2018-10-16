import { toBlob, scale, rotate, crop } from "./canvas";

interface ICallback<T> {
  (error: Error, result: T): void
}

interface ICanvasReadStream {
  (cb: ICallback<HTMLCanvasElement>): void
}

export interface ITransformPipe {
  scale(ratio: number): ITransformPipe;
  rotate(theta: number): ITransformPipe;
  crop(x: number, y: number, width: number, height: number): ITransformPipe;
  toDataURL(cb: ICallback<string>): void;
  toBlob(cb: ICallback<Blob>): void;
}

export default class CanvasTransformPipe implements ITransformPipe {
  private reader: ICanvasReadStream;

  public constructor(readable: ICanvasReadStream) {
    this.reader = readable;
  }

  public scale(ratio: number): CanvasTransformPipe {
    return this.map(($canvas) => scale($canvas, ratio, ratio));
  }

  public rotate(theta: number): CanvasTransformPipe {
    return this.map(($canvas) => rotate($canvas, theta));
  }

  public crop(x: number, y: number, width: number, height: number): CanvasTransformPipe {
    return this.map(($canvas) => crop($canvas, x, y, width, height));
  }

  public toBlob(cb: ICallback<Blob>): void {
    this.reader((error, $canvas) => {
      if (error != null) {
        cb(error, null);
      } else {
        toBlob($canvas, (blob) => cb(null, blob));
      }
    })
  }

  public toDataURL(cb: ICallback<string>): void {
    this.reader((error, $canvas) => {
      if (error != null) {
        cb(error, null);
      } else {
        cb(null, $canvas.toDataURL())
      }
    });
  }

  private map(fn: ($canvas: HTMLCanvasElement) => HTMLCanvasElement): CanvasTransformPipe {
    return new CanvasTransformPipe((cb) => {
      this.reader((error, $canvas) => {
        if (error != null) {
          cb(error, null);
        } else {
          cb(null, fn($canvas));
        }
      });
    });
  }
}
