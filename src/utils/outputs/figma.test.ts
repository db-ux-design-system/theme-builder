import { describe, expect, it } from "vitest";
import { getFigmaColors } from "./figma.ts";
import { DefaultColorType, SpeakingName } from "../data.ts";

const luminanceSteps = [9, 20, 35, 50, 65, 80, 90, 96, 99];

// Minimal set of speaking names that reference the transparent background
// entries used by addTransparentColors. `light`/`dark` point at generated
// palette indices.
const transparentSpeakingNames: SpeakingName[] = [
  { name: "bg-basic-transparent-full-default", light: 6, dark: 2, transparencyLight: 100, transparencyDark: 100 },
  { name: "bg-basic-transparent-full-hovered", light: 6, dark: 2, transparencyLight: 84, transparencyDark: 84 },
  { name: "bg-basic-transparent-full-pressed", light: 6, dark: 2, transparencyLight: 76, transparencyDark: 76 },
  { name: "bg-basic-transparent-semi-default", light: 6, dark: 2, transparencyLight: 68, transparencyDark: 68 },
  { name: "bg-basic-transparent-semi-hovered", light: 6, dark: 2, transparencyLight: 60, transparencyDark: 60 },
  { name: "bg-basic-transparent-semi-pressed", light: 6, dark: 2, transparencyLight: 52, transparencyDark: 52 },
] as SpeakingName[];

const fullColor: DefaultColorType = {
  origin: "#1a73e8",
  originLightDefault: "#1a73e8",
  originLightHovered: "#155bb5",
  originLightPressed: "#104a94",
  onOriginLightDefault: "#ffffff",
  originDarkDefault: "#8ab4f8",
  originDarkHovered: "#aecbfa",
  originDarkPressed: "#c8ddfd",
  onOriginDarkDefault: "#000000",
};

describe("getFigmaColors", () => {
  it("produces valid JSON with origin and transparent tokens for a complete custom color", () => {
    const json = getFigmaColors(
      transparentSpeakingNames,
      luminanceSteps,
      { riff: fullColor },
    );

    const parsed = JSON.parse(json);
    expect(parsed.colors.riff["origin-light-default"]).toEqual({
      $type: "color",
      $value: "#1a73e8",
    });
    // Transparent tokens are derived from the speaking names.
    expect(parsed.colors.riff["transparent-full-light-default"]).toBeDefined();
    expect(parsed.colors.riff["transparent-semi-dark-pressed"]).toBeDefined();
  });

  it("does not throw when optional origin fields are missing (regression #1235)", () => {
    const minimalColor: DefaultColorType = { origin: "#ff8800" };

    expect(() =>
      getFigmaColors(transparentSpeakingNames, luminanceSteps, {
        riff: minimalColor,
      }),
    ).not.toThrow();

    const parsed = JSON.parse(
      getFigmaColors(transparentSpeakingNames, luminanceSteps, {
        riff: minimalColor,
      }),
    );
    // Missing optional fields are simply omitted, no undefined values emitted.
    expect(parsed.colors.riff["origin-light-default"]).toBeUndefined();
    expect(parsed.colors.riff["on-origin-dark-default"]).toBeUndefined();
    // The generated palette tokens are still present.
    expect(parsed.colors.riff["0"]).toBeDefined();
  });

  it("does not throw when the transparent speaking names are missing (regression #1235)", () => {
    expect(() =>
      getFigmaColors([], luminanceSteps, { riff: fullColor }),
    ).not.toThrow();

    const parsed = JSON.parse(getFigmaColors([], luminanceSteps, { riff: fullColor }));
    // No transparent tokens can be derived, but origin tokens remain intact.
    expect(parsed.colors.riff["transparent-full-light-default"]).toBeUndefined();
    expect(parsed.colors.riff["origin-light-default"]).toEqual({
      $type: "color",
      $value: "#1a73e8",
    });
  });

  it("handles an empty custom colors map", () => {
    const parsed = JSON.parse(getFigmaColors(transparentSpeakingNames, luminanceSteps, {}));
    expect(parsed).toEqual({ colors: {} });
  });
});
