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
