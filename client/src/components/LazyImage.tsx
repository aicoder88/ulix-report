import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type LazyImageProps = Omit<ComponentProps<"img">, "src"> & {
  src: string;
  rootMargin?: string;
};

export function LazyImage({
  src,
  alt,
  className,
  rootMargin = "240px",
  ...props
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const hostRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || isVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <span
      ref={hostRef}
      className={cn(
        "block h-full w-full overflow-hidden bg-secondary/40",
        className
      )}
    >
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full", className)}
          loading="lazy"
          decoding="async"
          {...props}
        />
      ) : (
        <span
          aria-hidden="true"
          className="block h-full w-full bg-[linear-gradient(110deg,rgba(15,118,110,0.08),rgba(249,115,22,0.12),rgba(15,118,110,0.08))] bg-[length:200%_100%] animate-pulse"
        />
      )}
    </span>
  );
}
