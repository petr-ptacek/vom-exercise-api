// *********** formula ***********
// newHeight = (originalHeight / originalWidth) * newWidth
// newWidth = (newHeight * originalWidth) / originalHeight

export interface ImgAspectRatioOptions {
  originalWidth: number;
  originalHeight: number;
  newWidth?: number;
  newHeight?: number;
}

export interface ImgAspectRatioResult {
  width: number;
  height: number;
}

export function aspectRatio(options: ImgAspectRatioOptions): ImgAspectRatioResult {
  const { originalHeight, originalWidth, newWidth, newHeight } = options;
  const result = {
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