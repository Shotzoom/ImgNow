import { rotate, crop, scale } from "./canvas";

export default class TransformPipe {
  private _$canvas: HTMLCanvasElement = null;
  private _dataUrl: string = null;

  constructor ($canvas: HTMLCanvasElement) {
    if ($canvas == null) {
      throw new TypeError('Expected canvas.');
    }

    this._$canvas = $canvas;
  }

  public get dataURL(): string {
    if (this._dataUrl == null) {
      this._dataUrl = this._$canvas.toDataURL();
    }

    return this._dataUrl;
  }

  public get width(): number {
    return this._$canvas.width;
  }

  public get height(): number {
    return this._$canvas.width;
  }

  public crop(x: number, y: number, width: number, height: number): TransformPipe {
    return new TransformPipe(crop(this._$canvas, x, y, width, height));
  }

  public rotate(theta: number): TransformPipe {
    return new TransformPipe(rotate(this._$canvas, theta));
  }

  public scale(ratio: number): TransformPipe {
    return new TransformPipe(scale(this._$canvas, ratio, ratio));
  }
}
