import TransformPipe from "./TransformPipe";
import { createFromImage } from './canvas';
import { isElement, isBlob } from "./utils";

type TransformContext = HTMLCanvasElement | HTMLImageElement | Blob;

interface IFactoryCallback {
  (error: Error, pipe: TransformPipe): void
}

function fromCanvas($canvas: HTMLCanvasElement, cb: IFactoryCallback): void {
  cb(null, new TransformPipe($canvas));
}

function fromImage($image: HTMLImageElement, cb: IFactoryCallback): void {
  createFromImage($image, (error, $canvas) => {
    cb(error, new TransformPipe($canvas));
  })
}

function fromBlob(blob: Blob, cb: IFactoryCallback): void {
  const $image = new Image();
  const reader = new FileReader();

  reader.onload = () => {
    $image.src = reader.result as string;
    fromImage($image, cb);
  };

  reader.onerror = () => {
    cb(new Error('Unable to read blob.'), null);
  };

  reader.readAsDataURL(blob);
}

export default function factory(context: TransformContext, cb: IFactoryCallback) {
  if (context == null) {
    throw new TypeError('Expected a context.');
  }

  if (cb == null) {
    throw new TypeError('Expected a callback.');
  }

  if (isElement(context)) {
    const $element = context as HTMLElement;

    switch($element.tagName) {
      case 'IMG':
        fromImage($element as HTMLImageElement, cb);
        break;
      case 'CANVAS':
        fromCanvas($element as HTMLCanvasElement, cb);
        break;
      default:
        throw new Error(`Could not create TransformPipe from element type '${$element.tagName}'.`);
    }
  } else if (isBlob(context)) {
    fromBlob(context as Blob, cb);
  }
}
