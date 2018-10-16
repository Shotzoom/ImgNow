import TransformPipe, { ITransformPipe } from "./CanvasTransformPipe";
import { createFromImage } from './canvas';
import { isElement, isBlob } from "./utils";

type TransformContext = HTMLCanvasElement | HTMLImageElement | Blob;

function fromCanvas($canvas: HTMLCanvasElement): ITransformPipe {
  return new TransformPipe((cb) => {
    cb(null, $canvas);
  });
}

function fromImage($image: HTMLImageElement): ITransformPipe {
  return new TransformPipe((cb) => {
    createFromImage($image, cb);
  });
}

function fromBlob(blob: Blob): ITransformPipe {
  return new TransformPipe((cb) => {
    const $image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      $image.src = reader.result as string;
      createFromImage($image, cb);
    };

    reader.onerror = () => {
      cb(new Error('Unable to read blob.'), null);
    };

    reader.readAsDataURL(blob);
  });
}

export default function create(context: TransformContext): ITransformPipe {
  if (context == null) {
    throw new TypeError('Expected a context.');
  }

  if (isElement(context)) {
    const $element = context as HTMLElement;

    switch($element.tagName) {
      case 'IMG':
        return fromImage($element as HTMLImageElement);
      case 'CANVAS':
        return fromCanvas($element as HTMLCanvasElement);
      default:
        throw new Error(`Could not create TransformPipe from element type '${$element.tagName}'.`);
    }
  } else if (isBlob(context)) {
    return fromBlob(context as Blob);
  }
}
