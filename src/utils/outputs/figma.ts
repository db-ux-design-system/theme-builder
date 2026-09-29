import { DefaultColorType, SpeakingName } from "../data.ts";
import { getHeissluftColors } from "../generate-colors.ts";
import chroma from "chroma-js";

interface FigmaColorToken {
  $type: "color";
  $value: string;
}
type FigmaColorSet = Record<string, FigmaColorToken>;

const addTransparentColors = (
  speakingNames: SpeakingName[],
  color: FigmaColorSet,
) => {
  const findByName = (needle: string): SpeakingName | undefined =>
    speakingNames.find(({ name }) => name.includes(needle));

  const groups: {
    key: string;
    def?: SpeakingName;
    hovered?: SpeakingName;
    pressed?: SpeakingName;
  }[] = [
    {
      key: "full",
      def: findByName("bg-basic-transparent-full-default"),
      hovered: findByName("bg-basic-transparent-full-hovered"),
      pressed: findByName("bg-basic-transparent-full-pressed"),
    },
    {
      key: "semi",
      def: findByName("bg-basic-transparent-semi-default"),
      hovered: findByName("bg-basic-transparent-semi-hovered"),
      pressed: findByName("bg-basic-transparent-semi-pressed"),
    },
  ];

  // Build a transparent color from a speaking name reference. Returns undefined
  // when the referenced base color or its transparency value is missing, so a
  // custom theme with incomplete data does not crash the whole export.
  const buildAlpha = (
    source: SpeakingName,
    mode: "light" | "dark",
  ): string | undefined => {
    const baseColor = color[source[mode]];
    const transparency =
      mode === "light" ? source.transparencyLight : source.transparencyDark;
    if (!baseColor || transparency === undefined) {
      return undefined;
    }
    return chroma(baseColor.$value)
      .alpha((100 - transparency) / 100)
      .hex("rgba");
  };

  const setToken = (name: string, value: string | undefined) => {
    if (value) {
      color[name] = { $type: "color", $value: value };
    }
  };

  for (const { key, def, hovered, pressed } of groups) {
    if (!def || !hovered || !pressed) {
      continue;
    }
    for (const mode of ["light", "dark"] as const) {
      setToken(`transparent-${key}-${mode}-default`, buildAlpha(def, mode));
      setToken(`transparent-${key}-${mode}-hovered`, buildAlpha(hovered, mode));
      setToken(`transparent-${key}-${mode}-pressed`, buildAlpha(pressed, mode));
    }
  }
};

export const getFigmaColors = (
  speakingNames: SpeakingName[],
  luminanceSteps: number[],
  customColors: Record<string, DefaultColorType>,
): string => {
  const result: Record<string, any> = {};
  Object.entries(customColors).forEach(([key, value]) => {
    let color: FigmaColorSet = {};
    const hslColors = getHeissluftColors(key, value.origin, luminanceSteps);
    hslColors.forEach((hslColor, index) => {
      color[index] = {
        $type: "color",
        $value: hslColor.hex,
      };
    });

    // Only include origin tokens that actually have a value. These fields are
    // optional on DefaultColorType, so a custom theme may not provide them and
    // we must not emit tokens with an undefined value.
    const originTokens: Record<string, string | undefined> = {
      "origin-light-default": value.originLightDefault,
      "origin-light-hovered": value.originLightHovered,
      "origin-light-pressed": value.originLightPressed,
      "on-origin-light-default": value.onOriginLightDefault,
      "origin-dark-default": value.originDarkDefault,
      "origin-dark-hovered": value.originDarkHovered,
      "origin-dark-pressed": value.originDarkPressed,
      "on-origin-dark-default": value.onOriginDarkDefault,
    };

    color = { ...color };
    for (const [tokenName, tokenValue] of Object.entries(originTokens)) {
      if (tokenValue) {
        color[tokenName] = { $type: "color", $value: tokenValue };
      }
    }

    addTransparentColors(speakingNames, color);

    result[key] = color;
  });

  return JSON.stringify({ colors: result });
};
