export function create(width: number, height: number): HTMLCanvasElement {
  var $canvas = document.createElement('canvas');
  $canvas.width = width;
  $canvas.height = height;

  return $canvas;
}

export function createFromImage($image: HTMLImageElement, cb: (error: Error, $canvas: HTMLCanvasElement) => void): void {
  if ($image.complete) {
    if ($image.naturalWidth === 0) {
      onError();
    } else {
      onLoad();
    }
  } else {
    $image.addEventListener('load', onLoad);
    $image.addEventListener('error', onError);
  }

  function onError() {
    cb(new Error('Image could not be loaded.'), null);
  }

  function onLoad() {
    $image.removeEventListener('load', onLoad);
    $image.removeEventListener('error', onError);

    const $canvas = create($image.naturalWidth, $image.naturalHeight);
    const context = $canvas.getContext('2d');

    context.drawImage($image, 0, 0, $canvas.width, $canvas.height);
    cb(null, $canvas);
  }
}

export function toBlob($canvas: HTMLCanvasElement, cb: BlobCallback) {
  const url = $canvas.toDataURL();
  const data = url.split(',')[0];

  setTimeout(function() {
    var raw = atob(data);
    var length = raw.length;
    var buffer = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      buffer[i] = raw.charCodeAt(i);
    }

    cb(new Blob([buffer]));
  });
}

export function scale($canvas: HTMLCanvasElement, x: number, y: number): HTMLCanvasElement {
  const $result = create($canvas.width * x, $canvas.height * y);
  const context = $result.getContext('2d');

  context.drawImage($canvas, 0, 0, $result.width, $result.height);

  return $result;
}

export function rotate($canvas: HTMLCanvasElement, theta: number): HTMLCanvasElement {
  const boundary = [
    [0, 0],
    [$canvas.width, 0],
    [$canvas.width, $canvas.height],
    [0, $canvas.height]
  ];

  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  let x0 = Number.MAX_VALUE;
  let x1 = Number.MIN_VALUE;
  let y0 = Number.MAX_VALUE;
  let y1 = Number.MIN_VALUE;

  for (var i = 0; i < boundary.length; i++) {
    const x = boundary[i][0];
    const y = boundary[i][1];
    const xx = x * cos - y * sin;
    const yy = y * cos + x * sin;

    x0 = Math.min(x0, xx);
    x1 = Math.max(x1, xx);
    y0 = Math.min(y0, yy);
    y1 = Math.max(y1, yy);
  }

  const $result = create(x1 - x0, y1 - y0);
  const context = $result.getContext('2d');

  context.translate(-x0, -y0);
  context.rotate(theta);
  context.drawImage($canvas, 0, 0);

  return $result;
}

export function crop($canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number): HTMLCanvasElement {
  const $result = create(width, height);
  const context = $result.getContext('2d');

  context.drawImage($canvas, x, y, width, height, 0, 0, width, height);

  return $result;
}
