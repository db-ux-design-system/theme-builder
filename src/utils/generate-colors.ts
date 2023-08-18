import chroma from "chroma-js";
import { ColorType, DefaultColorMappingType } from "./data.ts";
import { getContrastSuggestion, getLuminance } from "./index.ts";

const mixValue1 = 1;
const mixValue2 = 0.75;
const mixValue3 = 0.5;
const mixValue4 = 0.25;
const mixValue5 = 0;
const mixValue6 = 0.92;
const mixValue7 = 0.64;
const mixValue8 = 0.32;
const mixValue9 = 0.16;
const mixValue10 = 0.08;
const mixValue11 = 0.04;

const transparent = chroma([0, 0, 0, 0]);

export const getNeutralStrong = (color: string, darkMode?: boolean): string =>
  chroma(color)
    .mix(darkMode ? "#fff" : "#000", mixValue11)
    .hex();

export const generateColors = (
  defaultColorMapping: DefaultColorMappingType,
  darkMode?: boolean,
): ColorType[] => {
  const colors: ColorType[] = [];

  const colorKeys = Object.keys(defaultColorMapping);

  const shading1 = darkMode ? "#000" : "#fff";
  const shading2 = darkMode ? "#fff" : "#000";

  colorKeys
    .filter((key) => !key.startsWith("on") && !key.startsWith("bg"))
    .forEach((key) => {
      const color: string = (defaultColorMapping as any)[key];

      const bgLuminance = getLuminance(defaultColorMapping.bgNeutralStrong);
      const bgLuminanceShading = bgLuminance < 0.4 ? "#fff" : "#000";

      const background = chroma(color).mix(shading1, mixValue6).hex();
      const onBG =
        key === "neutral"
          ? defaultColorMapping.onBgNeutral
          : chroma(color).mix(shading2, mixValue7).hex();
      const element =
        getContrastSuggestion(
          defaultColorMapping.bgNeutralStrong,
          color,
          3.0,
          bgLuminance >= 0.4,
          true,
        ) || color;

      let colorResult: ColorType = {
        name: key,
        enabled: chroma(color).hex(),
        hover: chroma(color).mix(bgLuminanceShading, mixValue9).hex(),
        pressed: chroma(color).mix(bgLuminanceShading, mixValue8).hex(),
        "on-enabled": chroma(shading1)
          .mix(transparent, darkMode ? mixValue2 : mixValue1)
          .hex(),
        "on-hover": chroma(shading1)
          .mix(transparent, darkMode ? mixValue3 : mixValue2)
          .hex(),
        "on-pressed": chroma(shading1)
          .mix(transparent, darkMode ? mixValue4 : mixValue3)
          .hex(),
        "bg-enabled": background,
        "bg-hover": chroma(background).mix(color, mixValue9).hex(),
        "bg-pressed": chroma(background).mix(color, mixValue8).hex(),
        "on-bg-enabled": onBG,
        "on-bg-hover": chroma(onBG).mix(transparent, mixValue2).hex(),
        "on-bg-pressed": chroma(onBG).mix(transparent, mixValue3).hex(),
        "on-bg-weak-enabled": chroma(onBG).mix(transparent, mixValue2).hex(),
        "on-bg-weak-hover": chroma(onBG).mix(transparent, mixValue3).hex(),
        "on-bg-weak-pressed": chroma(onBG).mix(transparent, mixValue4).hex(),
        "bg-transparent-full-enabled": chroma(color)
          .mix(transparent, mixValue5)
          .hex(),
        "bg-transparent-full-hover": chroma(color)
          .mix(transparent, mixValue9)
          .hex(),
        "bg-transparent-full-pressed": chroma(color)
          .mix(transparent, mixValue8)
          .hex(),
        "bg-transparent-semi-enabled": chroma(color)
          .mix(transparent, mixValue10)
          .hex(),
        "bg-transparent-semi-hover": chroma(color)
          .mix(transparent, mixValue9)
          .hex(),
        "bg-transparent-semi-pressed": chroma(color)
          .mix(transparent, mixValue8)
          .hex(),
      };

      if (element) {
        const elementHover = chroma(element).mix(shading2, mixValue9).hex();
        const elementPressed = chroma(element).mix(shading2, mixValue8).hex();
        colorResult = {
          ...colorResult,
          "element-enabled": element,
          "element-hover": elementHover,
          "element-pressed": elementPressed,
          "border-enabled": chroma(element)
            .mix(transparent, darkMode ? mixValue2 : mixValue7)
            .hex(),
          "border-hover": chroma(elementHover)
            .mix(transparent, darkMode ? mixValue2 : mixValue7)
            .hex(),
          "border-pressed": chroma(elementPressed)
            .mix(transparent, darkMode ? mixValue2 : mixValue7)
            .hex(),
          "border-weak-enabled": chroma(element)
            .mix(transparent, darkMode ? mixValue3 : mixValue8)
            .hex(),
          "border-weak-hover": chroma(elementHover)
            .mix(transparent, darkMode ? mixValue3 : mixValue8)
            .hex(),
          "border-weak-pressed": chroma(elementPressed)
            .mix(transparent, darkMode ? mixValue3 : mixValue8)
            .hex(),
        };
      }

      if (key === "brand") {
        const text =
          getContrastSuggestion(
            defaultColorMapping.bgNeutralStrong,
            color,
            4.5,
            bgLuminance < 0.4,
          ) || color;
        colorResult = {
          ...colorResult,
          "on-enabled": chroma(defaultColorMapping.onBrand).hex(),
          "on-hover": chroma(defaultColorMapping.onBrand)
            .mix(transparent, mixValue2)
            .hex(),
          "on-pressed": chroma(defaultColorMapping.onBrand)
            .mix(transparent, mixValue3)
            .hex(),
          "text-enabled": text,
          "text-hover": chroma(text).mix(shading2, mixValue9).hex(),
          "text-pressed": chroma(text).mix(shading2, mixValue8).hex(),
        };
      }

      if (key === "neutral") {
        colorResult = {
          ...colorResult,
          "bg-enabled": chroma(defaultColorMapping.bgNeutral).hex(),
          "bg-hover": chroma(defaultColorMapping.bgNeutral)
            .mix(bgLuminanceShading, mixValue9)
            .hex(),
          "bg-pressed": chroma(defaultColorMapping.bgNeutral)
            .mix(bgLuminanceShading, mixValue8)
            .hex(),
          "bg-strong-enabled": chroma(
            defaultColorMapping.bgNeutralStrong,
          ).hex(),
          "bg-strong-hover": chroma(defaultColorMapping.bgNeutralStrong)
            .mix(bgLuminanceShading, mixValue9)
            .hex(),
          "bg-strong-pressed": chroma(defaultColorMapping.bgNeutralStrong)
            .mix(bgLuminanceShading, mixValue8)
            .hex(),
        };
      }

      colors.push(colorResult);
    });

  return colors;
};
