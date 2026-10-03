"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  ExternalLink,
} from "lucide-react";

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  src,
  alt = "Preview",
}) => {
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  // Reset zoom & rotation when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => (prev === 1 ? 1.75 : 1));
  };

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      } else if (e.key === "0") {
        handleReset();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      {/* Top Navigation Bar */}
      <div
        className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10 shrink-0 select-none z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 text-white min-w-0 pr-4">
          <p className="text-sm font-medium truncate max-w-xs md:max-w-md">
            {alt}
          </p>
          <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleRotate}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            title="Rotate 90°"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            title="Reset (0)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            title="Open in new tab"
          >
            <ExternalLink className="w-5 h-5" />
          </a>

          <div className="w-[1px] h-6 bg-white/20 mx-1" />

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-white hover:bg-red-500/80 rounded-lg transition cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image Display Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 select-none cursor-grab active:cursor-grabbing">
        <div
          className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-full"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
          onClick={handleToggleClick}
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] max-w-[85vw] w-auto h-auto object-contain rounded-lg shadow-2xl transition cursor-zoom-in"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="py-2 text-center text-xs text-gray-400 bg-black/40 border-t border-white/5 select-none pointer-events-none">
        Click image to toggle zoom &bull; Use buttons or scroll/keys (+, -, 0) to adjust &bull; Esc to close
      </div>
    </div>
  );
};

export default ImageZoomModal;
