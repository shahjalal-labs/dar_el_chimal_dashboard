/* eslint-disable @typescript-eslint/no-explicit-any */
// types/react-pageflip.d.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-pageflip' {
  import { Component } from 'react';

  interface HTMLFlipBookProps {
    width?: number | string;
    height?: number | string;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    className?: string;
    style?: React.CSSProperties;
    startPage?: number;
    onFlip?: (e: any) => void;
    onChangeOrientation?: (e: any) => void;
    onChangeState?: (e: any) => void;
    children?: React.ReactNode;
  }

  interface PageFlip {
    flipNext: () => void;
    flipPrev: () => void;
    flip: (page: number) => void;
    getCurrentPageIndex: () => number;
    getTotalPages: () => number;
    loadFromImages: (images: string[]) => void;
    updateFromHtml: () => void;
    getOrientation: () => 'portrait' | 'landscape';
    getPageCount: () => number;
    destroy: () => void;
  }

  class HTMLFlipBook extends Component<HTMLFlipBookProps> {
    pageFlip: () => PageFlip;
  }

  export default HTMLFlipBook;
}