import TransformPipe from "./TransformPipe";
import { createFromImage, correctEXIFOrientation } from './canvas';
import exif, { EXIFReadResult } from './exif';
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
    if (error != null) {
      cb(error, null);
    } else {
      cb(null, new TransformPipe($canvas));
    }
  })
}

function fromBlob(blob: Blob, cb: IFactoryCallback): void {
  function onEXIFParsed(result: EXIFReadResult) {
    const reader = new FileReader();
    const $image = new Image();

    reader.onload = () => {
      $image.src = reader.result as string;

      createFromImage($image, (error, $canvas) => {
        if (error != null) {
          cb(error, null);
        } else if (result.success) {
          cb(null, new TransformPipe(correctEXIFOrientation($canvas, result.data.orientation)));
        } else {
          cb(null, new TransformPipe($canvas));
        }
      });
    };

    reader.onerror = () => {
      cb(reader.error, null);
    };

    reader.readAsDataURL(blob);
  }

  exif(blob, (error, data) => {
    if (error != null) {
      cb(error, null);
    } else {
      onEXIFParsed(data);
    }
  });
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
