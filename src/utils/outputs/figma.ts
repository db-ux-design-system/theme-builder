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
  const transparentFullDefault: any = speakingNames.find(({ name }) =>
    name.includes("bg-basic-transparent-full-default"),
  )!;
  const transparentSemiDefault: any = speakingNames.find(({ name }) =>
    name.includes("bg-basic-transparent-semi-default"),
  )!;
  const transparentFullHovered: any = speakingNames.find(({ name }) =>
    name.includes("bg-basic-transparent-full-hovered"),
  )!;
  const transparentFullPressed: any = speakingNames.find(({ name }) =>
    name.includes("bg-basic-transparent-full-pressed"),
  )!;
  const transparentSemiHovered: any = speakingNames.find(({ name }) =>
    name.includes("bg-basic-transparent-semi-hovered"),
  )!;
  const transparentSemiPressed: any = speakingNames.find(({ name }) =>
    name.includes("bg-basic-transparent-semi-pressed"),
  )!;

  for (const { def, key, pressed, hovered } of [
    {
      key: "full",
      def: transparentFullDefault,
      hovered: transparentFullHovered,
      pressed: transparentFullPressed,
    },
    {
      key: "semi",
      def: transparentSemiDefault,
      hovered: transparentSemiHovered,
      pressed: transparentSemiPressed,
    },
  ]) {
    for (const mode of ["light", "dark"]) {
      const transparency =
        mode === "light" ? def.transparencyLight : def.transparencyDark;
      const transparencyHover =
        mode === "light"
          ? hovered.transparencyLight
          : hovered.transparencyDark;
      const transparencyPressed =
        mode === "light"
          ? pressed.transparencyLight
          : pressed.transparencyDark;
      color[`transparent-${key}-${mode}-default`] = {
        $type: "color",
        $value: chroma(color[def[mode]].$value)
          .alpha((100 - transparency) / 100)
          .hex("rgba"),
      };
      color[`transparent-${key}-${mode}-hovered`] = {
        $type: "color",
        $value: chroma(color[hovered[mode]].$value)
          .alpha((100 - transparencyHover) / 100)
          .hex("rgba"),
      };
      color[`transparent-${key}-${mode}-pressed`] = {
        $type: "color",
        $value: chroma(color[pressed[mode]].$value)
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
    let color: FigmaColorSet = {};
    const hslColors = getHeissluftColors(key, value.origin, luminanceSteps);
    hslColors.forEach((hslColor, index) => {
      color[index] = {
        $type: "color",
        $value: hslColor.hex,
      };
    });

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
