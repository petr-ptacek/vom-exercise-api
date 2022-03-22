// *********** formula ***********
// newHeight = (originalHeight / originalWidth) * newWidth
// newWidth = (newHeight * originalWidth) / originalHeight

export type AspectRatioAreaOptionsT = {
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
}

export type AspectRatioAreaResultT = {
  width: number;
  height: number;
}

export function computeAreaBasedAspectRatio(options: AspectRatioAreaOptionsT): AspectRatioAreaResultT {
  const {
    originalHeight,
    originalWidth,
    newWidth,
    newHeight
  } = options;

  const result: AspectRatioAreaResultT = {
    width: newWidth,
    height: newHeight
  };

  if ( originalWidth > originalHeight ) {
    // result.width = newWidth;
    result.height = Math.round((originalHeight / originalWidth) * newWidth);
  } else {
    result.width = Math.round((newHeight * originalWidth) / originalHeight);
    // result.height = newHeight;
  }

  return result;
}