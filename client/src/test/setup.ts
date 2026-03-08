import { afterEach, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

beforeAll(() => {
  window.scrollTo = vi.fn();
  window.requestAnimationFrame = callback => {
    callback(0);
    return 0;
  };
  window.cancelAnimationFrame = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: MockResizeObserver,
  });
});

afterEach(() => {
  cleanup();
  window.location.hash = "";
});

vi.mock("framer-motion", () => {
  const createMotionComponent = (tag: string) =>
    React.forwardRef<HTMLElement, Record<string, unknown>>(
      ({ children, ...props }, ref) => {
        const {
          animate,
          exit,
          initial,
          transition,
          variants,
          viewport,
          whileHover,
          whileInView,
          whileTap,
          ...domProps
        } = props;

        void animate;
        void exit;
        void initial;
        void transition;
        void variants;
        void viewport;
        void whileHover;
        void whileInView;
        void whileTap;

        return React.createElement(
          tag,
          { ...domProps, ref },
          children as React.ReactNode
        );
      }
    );

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: new Proxy(
      {},
      {
        get: (_target, key: string) => createMotionComponent(key),
      }
    ),
    useReducedMotion: () => true,
    useScroll: () => ({ scrollYProgress: 0 }),
    useTransform: () => 0,
  };
});
