/**
 * ImageZoom Component - Hover zoom effect for product images
 */

import { useState, useRef } from 'react';

const ImageZoom = ({ 
  src, 
  alt = '', 
  emoji = null, // For emoji images
  zoomLevel = 2,
  className = ''
}) => {
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  const handleMouseEnter = () => setIsZooming(true);
  const handleMouseLeave = () => setIsZooming(false);

  // Emoji rendering
  if (emoji) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden cursor-zoom-in ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={`flex items-center justify-center w-full h-full transition-transform duration-200 ${
            isZooming ? 'scale-150' : 'scale-100'
          }`}
          style={{
            transformOrigin: `${position.x}% ${position.y}%`
          }}
        >
          <span className="text-8xl md:text-9xl">{emoji}</span>
        </div>
      </div>
    );
  }

  // Image rendering with magnifying effect
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Original Image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-opacity duration-200"
        style={{ opacity: isZooming ? 0.3 : 1 }}
      />

      {/* Zoomed Image */}
      {isZooming && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}

      {/* Zoom indicator */}
      {!isZooming && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-70">
          Hover to zoom
        </div>
      )}
    </div>
  );
};

// Lens zoom variant - shows magnified area in a lens
export const ImageZoomLens = ({ 
  src, 
  alt = '', 
  emoji = null,
  lensSize = 150,
  zoomLevel = 2.5,
  className = ''
}) => {
  const [showLens, setShowLens] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clamp lens position to container
    const clampedX = Math.max(lensSize / 2, Math.min(rect.width - lensSize / 2, x));
    const clampedY = Math.max(lensSize / 2, Math.min(rect.height - lensSize / 2, y));

    setLensPosition({ 
      x: clampedX - lensSize / 2, 
      y: clampedY - lensSize / 2 
    });

    // Calculate background position for zoom
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;
    setBackgroundPosition({ x: bgX, y: bgY });
  };

  if (emoji) {
    return (
      <div
        ref={containerRef}
        className={`relative ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowLens(true)}
        onMouseLeave={() => setShowLens(false)}
      >
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-8xl md:text-9xl">{emoji}</span>
        </div>

        {showLens && (
          <div
            className="absolute pointer-events-none border-2 border-white shadow-xl rounded-full overflow-hidden"
            style={{
              width: lensSize,
              height: lensSize,
              left: lensPosition.x,
              top: lensPosition.y,
            }}
          >
            <div 
              className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <span className="text-4xl">{emoji}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowLens(true)}
      onMouseLeave={() => setShowLens(false)}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />

      {showLens && (
        <div
          className="absolute pointer-events-none border-4 border-white shadow-2xl rounded-full overflow-hidden"
          style={{
            width: lensSize,
            height: lensSize,
            left: lensPosition.x,
            top: lensPosition.y,
            backgroundImage: `url(${src})`,
            backgroundSize: `${containerRef.current?.offsetWidth * zoomLevel}px ${containerRef.current?.offsetHeight * zoomLevel}px`,
            backgroundPosition: `${-backgroundPosition.x * zoomLevel + lensSize / 2}px ${-backgroundPosition.y * zoomLevel + lensSize / 2}px`
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;
