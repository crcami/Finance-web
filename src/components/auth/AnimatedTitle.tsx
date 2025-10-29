import { useEffect, useState, useRef } from "react";

interface AnimatedTitleProps {
  text?: string;
  fontSize?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export function AnimatedTitle({ 
  text = "Finance Aplicativo", 
  fontSize = "3rem",
  className = "mb-12",
  align = "center"
}: AnimatedTitleProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [titleBounds, setTitleBounds] = useState<DOMRect | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      const updateBounds = () => {
        if (titleRef.current) {
          setTitleBounds(titleRef.current.getBoundingClientRect());
        }
      };
      
      updateBounds();
      window.addEventListener("resize", updateBounds);
      return () => window.removeEventListener("resize", updateBounds);
    }
  }, []);

  const getColorBasedOnPosition = (x: number, y: number) => {
    if (!titleBounds) return "#ffffff";

    const relativeX = x - titleBounds.left;
    const relativeY = y - titleBounds.top;

    if (
      relativeX < 0 ||
      relativeX > titleBounds.width ||
      relativeY < 0 ||
      relativeY > titleBounds.height
    ) {
      return "#ffffff";
    }

    const normalizedX = relativeX / titleBounds.width;
    const normalizedY = relativeY / titleBounds.height;

    // Cores: #1A2A4F, #C2E2FA, #9ECFD4
    const colors = [
      { r: 26, g: 42, b: 79 }, // #1A2A4F
      { r: 194, g: 226, b: 250 }, // #C2E2FA
      { r: 158, g: 207, b: 212 }, // #9ECFD4
    ];

    let color;
    if (normalizedX < 0.5) {
      const t = normalizedX * 2;
      color = {
        r: colors[0].r + (colors[1].r - colors[0].r) * t,
        g: colors[0].g + (colors[1].g - colors[0].g) * t,
        b: colors[0].b + (colors[1].b - colors[0].b) * t,
      };
    } else {
      const t = (normalizedX - 0.5) * 2;
      color = {
        r: colors[1].r + (colors[2].r - colors[1].r) * t,
        g: colors[1].g + (colors[2].g - colors[1].g) * t,
        b: colors[1].b + (colors[2].b - colors[1].b) * t,
      };
    }

    const yMix = Math.abs(normalizedY - 0.5) * 0.3;
    color.r = Math.round(color.r * (1 - yMix) + 255 * yMix);
    color.g = Math.round(color.g * (1 - yMix) + 255 * yMix);
    color.b = Math.round(color.b * (1 - yMix) + 255 * yMix);

    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  };

  const textColor = getColorBasedOnPosition(mousePosition.x, mousePosition.y);

  return (
    <h1
      ref={titleRef}
      className={`text-white transition-colors duration-300 ease-out cursor-default select-none ${className}`}
      style={{
        color: textColor,
        fontSize: fontSize,
        fontWeight: 700,
        textAlign: align,
        textShadow: "0 2px 20px rgba(0, 0, 0, 0.3)",
      }}
    >
      {text}
    </h1>
  );
}
