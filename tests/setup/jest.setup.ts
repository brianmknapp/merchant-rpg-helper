import "@testing-library/jest-dom";
import { beforeEach, jest } from "@jest/globals";
import React from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    void fill;
    return React.createElement("img", props);
  },
}));

const ResizeObserverMock = class {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

global.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;

if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: unknown) => ({
      matches: false,
      media: query as string,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
    writable: true,
    value: jest.fn(),
  });
}

const writeText = jest.fn().mockResolvedValue(undefined as never);

if (typeof navigator !== "undefined") {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

beforeEach(() => {
  writeText.mockClear();
});



