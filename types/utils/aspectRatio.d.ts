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
export declare function aspectRatio(options: ImgAspectRatioOptions): ImgAspectRatioResult;
//# sourceMappingURL=aspectRatio.d.ts.map