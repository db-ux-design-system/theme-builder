import { DefaultColorType, SpeakingName } from "../data.ts";
import { getHeissluftColors } from "../generate-colors.ts";
import chroma from "chroma-js";

const addTransparentColors = (
  speakingNames: SpeakingName[],
  color: Record<string, { $type: string; $value: string }>,
) => {
  const transparentFullDefault: any = speakingNames.find(({ name }) =>
    name.includes("bg-basic-transparent-full-default"),
  )!;
  const transparentSemiDefault: any = speakingNames.find(({ name }) =>
    name.includes("bg-basic-transparent-semi-default"),
  )!;
  const transparentHovered: any = speakingNames.find(({ name }) =>
    name.includes("bg-basic-transparent-hovered"),
  )!;
  const transparentPressed: any = speakingNames.find(({ name }) =>
    name.includes("bg-basic-transparent-pressed"),
  )!;

  for (const [key1, value1] of Object.entries({
    full: transparentFullDefault,
    semi: transparentSemiDefault,
  })) {
    for (const mode of ["light", "dark"]) {
      const transparency =
        mode === "light" ? value1.transparencyLight : value1.transparencyDark;
      const transparencyHover =
        mode === "light"
          ? transparentHovered.transparencyLight
          : transparentHovered.transparencyDark;
      const transparencyPressed =
        mode === "light"
          ? transparentPressed.transparencyLight
          : transparentPressed.transparencyDark;
      color[`transparent-${key1}-${mode}-default`] = {
        $type: "color",
        $value: chroma(color[value1[mode]].$value)
          .alpha((100 - transparency) / 100)
          .hex("rgba"),
      };
      color[`transparent-${key1}-${mode}-hovered`] = {
        $type: "color",
        $value: chroma(color[transparentHovered[mode]].$value)
          .alpha((100 - transparencyHover) / 100)
          .hex("rgba"),
      };
      color[`transparent-${key1}-${mode}-pressed`] = {
        $type: "color",
        $value: chroma(color[transparentPressed[mode]].$value)
          .alpha((100 - transparencyPressed) / 100)
          .hex("rgba"),
      };
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
    let color: Record<string, { $type: string; $value: string }> = {};
    const hslColors = getHeissluftColors(key, value.origin, luminanceSteps);
    hslColors.forEach((hslColor, index) => {
      color[index] = {
        $type: "color",
        $value: hslColor.hex,
      };
    });

    console.log(key, value);

    color = {
      ...color,
      "origin-light-default": {
        $type: "color",
        $value: value.originLightDefault!,
      },
      "origin-light-hovered": {
        $type: "color",
        $value: value.originLightHovered!,
      },
      "origin-light-pressed": {
        $type: "color",
        $value: value.originLightPressed!,
      },
      "on-origin-light-default": {
        $type: "color",
        $value: value.onOriginLightDefault!,
      },
      "origin-dark-default": {
        $type: "color",
        $value: value.originDarkDefault!,
      },
      "origin-dark-hovered": {
        $type: "color",
        $value: value.originDarkHovered!,
      },
      "origin-dark-pressed": {
        $type: "color",
        $value: value.originDarkPressed!,
      },
      "on-origin-dark-default": {
        $type: "color",
        $value: value.onOriginDarkDefault!,
      },
    };

    addTransparentColors(speakingNames, color);

    result[key] = color;
  });

  return JSON.stringify({ colors: result });
};
