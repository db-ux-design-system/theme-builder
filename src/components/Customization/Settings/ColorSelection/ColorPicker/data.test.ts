import { describe, expect, it } from "vitest";
import { generateOnColorForBackgroundChange } from "./data.ts";
import { DefaultColorType } from "../../../../../utils/data.ts";
import { getContrast, getLuminance } from "../../../../../utils";

const MIN_CONTRAST = 4.5;

describe("generateOnColorForBackgroundChange (issue #1236)", () => {
  it("recalculates the dark on-origin color when the dark background changes to a light color", () => {
    // Start from a dark background whose on-origin color is white.
    const color: DefaultColorType = {
      origin: "#0a1a2f",
      originDarkDefault: "#0a1a2f",
      onOriginDarkDefault: "#ffffff",
    };

    // The user picks a light background for dark mode; the on-origin color must
    // flip to a dark color to keep a valid contrast.
    const result = generateOnColorForBackgroundChange(color, true, "#f2f2f2");

    expect(result.onOriginDarkDefault).toBeDefined();
    expect(result.onOriginDarkDefault).not.toBe("#ffffff");
    // The recalculated on-origin color is dark...
    expect(getLuminance(result.onOriginDarkDefault!)).toBeLessThan(0.5);
    // ...and provides an accessible contrast against the new background.
    expect(
      getContrast(result.originDarkDefault, result.onOriginDarkDefault),
    ).toBeGreaterThanOrEqual(MIN_CONTRAST);
  });

  it("recalculates the dark on-origin color when the dark background changes to a dark color", () => {
    const color: DefaultColorType = {
      origin: "#f2f2f2",
      originDarkDefault: "#f2f2f2",
      onOriginDarkDefault: "#000000",
    };

    const result = generateOnColorForBackgroundChange(color, true, "#101820");

    expect(getLuminance(result.onOriginDarkDefault!)).toBeGreaterThan(0.5);
    expect(
      getContrast(result.originDarkDefault, result.onOriginDarkDefault),
    ).toBeGreaterThanOrEqual(MIN_CONTRAST);
  });

  it("updates the dark background shades and leaves light-mode fields untouched", () => {
    const color: DefaultColorType = {
      origin: "#0a1a2f",
      originDarkDefault: "#0a1a2f",
      onOriginDarkDefault: "#ffffff",
      originLightDefault: "#0a1a2f",
      onOriginLightDefault: "#ffffff",
    };

    const result = generateOnColorForBackgroundChange(color, true, "#f2f2f2");

    // Dark background + its shades are refreshed.
    expect(result.originDarkDefault).toBe("#f2f2f2");
    expect(result.originDarkHovered).toBeDefined();
    expect(result.originDarkPressed).toBeDefined();
    // Light-mode values must not be affected by a dark-mode change.
    expect(result.originLightDefault).toBe("#0a1a2f");
    expect(result.onOriginLightDefault).toBe("#ffffff");
  });

  it("recalculates the light on-origin color when the light background changes", () => {
    const color: DefaultColorType = {
      origin: "#0a1a2f",
      originLightDefault: "#0a1a2f",
      onOriginLightDefault: "#ffffff",
      originDarkDefault: "#0a1a2f",
      onOriginDarkDefault: "#ffffff",
    };

    const result = generateOnColorForBackgroundChange(color, false, "#f2f2f2");

    expect(result.onOriginLightDefault).not.toBe("#ffffff");
    expect(
      getContrast(result.originLightDefault, result.onOriginLightDefault),
    ).toBeGreaterThanOrEqual(MIN_CONTRAST);
    // Dark-mode values must not be affected by a light-mode change.
    expect(result.originDarkDefault).toBe("#0a1a2f");
    expect(result.onOriginDarkDefault).toBe("#ffffff");
  });
});
