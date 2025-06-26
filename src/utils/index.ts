import chroma from "chroma-js";
import { FALLBACK_COLOR } from "../constants.ts";

export const isValidColor = (color: string): boolean => chroma.valid(color);

export const getLuminance = (color: string): number =>
  chroma.valid(color) ? chroma.hex(color).luminance() : -1;

export const getContrast = (
  color: string = FALLBACK_COLOR,
  bgColor: string = FALLBACK_COLOR,
): number =>
  chroma.valid(color) && chroma.valid(bgColor)
    ? chroma.contrast(color, bgColor)
    : -1;

export const kebabCase = (
  input: string,
  firstLower?: boolean,
  separator?: string,
): string => {
  try {
    return input
      .replace(/-/g, " ")
      .split(" ")
      .map(
        (split, index) =>
          (firstLower && index === 0 ? split[0] : split[0].toUpperCase()) +
          split.substring(1, split.length),
      )
      .join(separator || "");
  } catch (error) {
    console.error(error);
  }
  return "ERROR";
};

export const mergeObjectsRecursive = (obj1: any, obj2: any): any => {
  const result: any = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (
        obj1[key] &&
        typeof obj1[key] === "object" &&
        typeof obj2[key] === "object"
      ) {
        result[key] = mergeObjectsRecursive(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }
  }

  return result;
};
