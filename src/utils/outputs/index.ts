import { DefaultColorType, HeisslufType } from "../data.ts";
import { getHeissluftColors } from "../generate-colors.ts";

export const prefix = "db";

export const getPalette = (
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): Record<string, HeisslufType[]> =>
  Object.entries(allColors)
    .map((value) => {
      const name = value[0];
      const color = value[1];
      const hslColors: HeisslufType[] = getHeissluftColors(
        name,
        color.origin,
        luminanceSteps,
      );

      return {
        [name]: hslColors,
      };
    })
    .reduce(
      (previousValue, currentValue) => ({ ...previousValue, ...currentValue }),
      {},
    );

export const getPaletteOutput = (
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): any => {
  const palette: Record<string, HeisslufType[]> = getPalette(
    allColors,
    luminanceSteps,
  );
  const result: any = {};

  Object.entries(allColors).forEach(([unformattedName, color]) => {
    const name = unformattedName.toLowerCase();

    const hslType: HeisslufType[] = palette[unformattedName];
    hslType.forEach((hsl) => {
      result[`--${prefix}-${name}-${hsl.index ?? hsl.name}`] = hsl.hex;
    });

    result[`--${prefix}-${name}-origin`] = color.origin;
    result[`--${prefix}-${name}-origin-light-default`] =
      color.originLightDefault;
    result[`--${prefix}-${name}-origin-light-hovered`] =
      color.originLightHovered;
    result[`--${prefix}-${name}-origin-light-pressed`] =
      color.originLightPressed;
    result[`--${prefix}-${name}-on-origin-light-default`] =
      color.onOriginLightDefault;
    result[`--${prefix}-${name}-on-origin-light-hovered`] =
      color.onOriginLightHovered;
    result[`--${prefix}-${name}-on-origin-light-pressed`] =
      color.onOriginLightPressed;

    result[`--${prefix}-${name}-origin-dark-default`] = color.originDarkDefault;
    result[`--${prefix}-${name}-origin-dark-hovered`] = color.originDarkHovered;
    result[`--${prefix}-${name}-origin-dark-pressed`] = color.originDarkPressed;
    result[`--${prefix}-${name}-on-origin-dark-default`] =
      color.onOriginDarkDefault;
    result[`--${prefix}-${name}-on-origin-dark-hovered`] =
      color.onOriginDarkHovered;
    result[`--${prefix}-${name}-on-origin-dark-pressed`] =
      color.onOriginDarkPressed;
  });

  return result;
};

export const getSpeakingNames = (
  speakingNames: SpeakingName[],
  allColors: Record<string, DefaultColorType>,
): any => {
  const result: any = {};
  Object.entries(allColors).forEach(([unformattedName]) => {
    const name = unformattedName.toLowerCase();
    result[`--${prefix}-${name}-origin-default`] =
      `light-dark(var(--${prefix}-${name}-origin-light-default),var(--${prefix}-${name}-origin-dark-default))`;
    result[`--${prefix}-${name}-origin-hovered`] =
      `light-dark(var(--${prefix}-${name}-origin-light-hovered),var(--${prefix}-${name}-origin-dark-hovered))`;
    result[`--${prefix}-${name}-origin-pressed`] =
      `light-dark(var(--${prefix}-${name}-origin-light-pressed),var(--${prefix}-${name}-origin-dark-pressed))`;
    result[`--${prefix}-${name}-on-origin-default`] =
      `light-dark(var(--${prefix}-${name}-on-origin-light-default),var(--${prefix}-${name}-on-origin-dark-default))`;
    result[`--${prefix}-${name}-on-origin-hovered`] =
      `light-dark(var(--${prefix}-${name}-on-origin-light-hovered),var(--${prefix}-${name}-on-origin-dark-hovered))`;
    result[`--${prefix}-${name}-on-origin-pressed`] =
      `light-dark(var(--${prefix}-${name}-on-origin-light-pressed),var(--${prefix}-${name}-on-origin-dark-pressed))`;

    speakingNames.forEach((speakingName) => {
      if (
        speakingName.transparencyDark !== undefined ||
        speakingName.transparencyLight !== undefined
      ) {
        result[`--${prefix}-${name}-${speakingName.name}`] =
          `light-dark(color-mix(in srgb, transparent ${
            speakingName.transparencyLight
          }%, var(--${prefix}-${name}-${
            speakingName.light
          })),color-mix(in srgb, transparent ${
            speakingName.transparencyDark
          }%, var(--${prefix}-${name}-${speakingName.dark})))`;
      } else {
        result[`--${prefix}-${name}-${speakingName.name}`] =
          `light-dark(var(--${prefix}-${name}-${
            speakingName.light
          }),var(--${prefix}-${name}-${speakingName.dark}))`;
      }
    });
  });
  return result;
};