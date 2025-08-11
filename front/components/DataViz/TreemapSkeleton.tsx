import { useEffect, useRef, useState } from 'react';
import { CHART_HEIGHT } from '../../app/community/[siren]/components/constants';

type TreemapSkeletonProps = {
  height?: number;
};

export default function TreemapSkeleton({ 
  height = CHART_HEIGHT
}: TreemapSkeletonProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    const observer = new ResizeObserver(resize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
      resize();
    }

    return () => observer.disconnect();
  }, []);

  const width = containerWidth || 1486;

  // Generate random rectangle sizes for skeleton effect
  const rectangles = [
    { x: 0, y: 0, width: width * 0.4, height: height * 0.6 },
    { x: width * 0.4 + 4, y: 0, width: width * 0.6 - 4, height: height * 0.3 },
    { x: width * 0.4 + 4, y: height * 0.3 + 4, width: width * 0.25, height: height * 0.7 - 4 },
    { x: width * 0.65 + 8, y: height * 0.3 + 4, width: width * 0.35 - 8, height: height * 0.4 },
    { x: width * 0.65 + 8, y: height * 0.7 + 8, width: width * 0.35 - 8, height: height * 0.3 - 8 },
    { x: 0, y: height * 0.6 + 4, width: width * 0.2, height: height * 0.4 - 4 },
    { x: width * 0.2 + 4, y: height * 0.6 + 4, width: width * 0.2 - 4, height: height * 0.4 - 4 },
  ];

  return (
    <div className="relative animate-pulse" ref={containerRef}>
      <svg width={width} height={height}>
        {rectangles.map((rect, index) => (
          <rect
            key={index}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill="#E5E7EB"
            className="animate-pulse"
            style={{
              clipPath: 'inset(0 0 0 0 round 0.5rem 0 0.5rem 0)'
            }}
          />
        ))}
        {/* Skeleton text elements */}
        {rectangles.map((rect, index) => (
          rect.width > 80 && rect.height > 60 && (
            <g key={`text-${index}`}>
              {/* Price skeleton */}
              <rect
                x={rect.x + 8}
                y={rect.y + 8}
                width={Math.min(rect.width * 0.6, 100)}
                height={16}
                rx={2}
                fill="#D1D5DB"
              />
              {/* Label skeleton */}
              <rect
                x={rect.x + 8}
                y={rect.y + 32}
                width={Math.min(rect.width * 0.8, 140)}
                height={12}
                rx={2}
                fill="#D1D5DB"
              />
              {rect.height > 80 && (
                <rect
                  x={rect.x + 8}
                  y={rect.y + 48}
                  width={Math.min(rect.width * 0.6, 100)}
                  height={12}
                  rx={2}
                  fill="#D1D5DB"
                />
              )}
            </g>
          )
        ))}
      </svg>
    </div>
  );
}