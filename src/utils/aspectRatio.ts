// *********** formula ***********
// newHeight = (originalHeight / originalWidth) * newWidth
// newWidth = (newHeight * originalWidth) / originalHeight

export type AspectRatioOptionsT = {
  originalWidth: number;
  originalHeight: number;
  newWidth?: number;
  newHeight?: number;
}

export type AspectRatioResultT = {
  width: number;
  height: number;
}

export function aspectRatio(options: AspectRatioOptionsT): AspectRatioResultT {
  const {
    originalHeight,
    originalWidth,
    newWidth,
    newHeight
  } = options;

  const result: AspectRatioResultT = {
    width: originalWidth,
    height: originalHeight
  };

  if ( newWidth ) {
    return {
      width: newWidth,
      height: Math.round((originalHeight / originalWidth) * newWidth)
    };
  }

  if ( newHeight ) {
    return {
      width: Math.round((newHeight * originalWidth) / originalHeight),
      height: newHeight
    };
  }

  return result;
}