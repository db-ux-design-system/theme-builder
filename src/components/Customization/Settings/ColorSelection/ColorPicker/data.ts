import { DefaultColorType } from "../../../../../utils/data.ts";
import { Hsluv } from "hsluv";
import { getContrast } from "../../../../../utils";
import { FALLBACK_COLOR } from "../../../../../constants.ts";

export type ColorPickerType = {
  label: string;
  color: DefaultColorType;
  setOriginColor?: (color: DefaultColorType) => void;
  onAddColor?: (name: string, color: DefaultColorType) => void;
  customColor?: boolean;
  isAddColor?: boolean;
  onDelete?: () => void;
};

const DARK_COLOR_LUMINANCE = 50;

const getColor = (color: string | Hsluv, luminance?: number) => {
  const hsluv = new Hsluv();
  if (typeof color === "string") {
    hsluv.hsluvToHex();
    hsluv.hex = color;
    hsluv.hexToHsluv();
  } else {
    hsluv.hsluv_h = color.hsluv_h;
    hsluv.hsluv_s = color.hsluv_s;
    hsluv.hsluv_l = color.hsluv_l;
  }

  if (luminance !== undefined) {
    hsluv.hsluv_l = luminance;
  }

  return hsluv;
};

const pressedLuminanceChange = 10;
const getHoverPressedColors = (onOrigin: string, originColor: string) => {
  const originHsluv = new Hsluv();
  originHsluv.hex = originColor;
  originHsluv.hexToHsluv();
  const originLuminance = originHsluv.hsluv_l;
  const onOriginHsluv = new Hsluv();
  onOriginHsluv.hex = onOrigin;
  onOriginHsluv.hexToHsluv();

  // If the origin color is darker than the onOrigin color, we need to have a darker hovered and pressed color
  const tryDarken = originLuminance < onOriginHsluv.hsluv_l;

  const hoveredLuminanceChange =
    originLuminance < DARK_COLOR_LUMINANCE ? 25 : 20;

  let hoverColorLuminance: number;
  let pressedColorLuminance: number;

  const darkenedHoveredLuminance = originLuminance - hoveredLuminanceChange;
  const darkenedPressedLuminance = originLuminance - pressedLuminanceChange;
  const lightedHoveredLuminance = originLuminance + hoveredLuminanceChange;
  const lightedPressedLuminance = originLuminance + pressedLuminanceChange;

  // If the origin color is dark we try to darken the hovered and pressed color
  // But if we are blow 0 we need to lighten it and vice verse
  if (tryDarken) {
    if (darkenedHoveredLuminance < 0) {
      hoverColorLuminance = lightedHoveredLuminance;
      pressedColorLuminance = lightedPressedLuminance;
    } else {
      hoverColorLuminance = darkenedHoveredLuminance;
      pressedColorLuminance = darkenedPressedLuminance;
    }
  } else {
    if (lightedHoveredLuminance > 100) {
      hoverColorLuminance = darkenedHoveredLuminance;
      pressedColorLuminance = darkenedPressedLuminance;
    } else {
      hoverColorLuminance = lightedHoveredLuminance;
      pressedColorLuminance = lightedPressedLuminance;
    }
  }

  const hoveredHsluv = getColor(originColor, hoverColorLuminance);
  hoveredHsluv.hsluvToHex();
  const hoverColor = hoveredHsluv.hex;

  const pressedHsluv = getColor(originColor, pressedColorLuminance);
  pressedHsluv.hsluvToHex();
  const pressedColor = pressedHsluv.hex;

  console.log(
    originColor,
    originLuminance,
    onOrigin,
    onOriginHsluv.hsluv_l,
    tryDarken,
    hoveredHsluv,
    pressedHsluv,
  );

  return { hoverColor, pressedColor };
};

const getOnColorByContrast = (
  originBgColor: string,
  darkColor: boolean,
): { onColor: Hsluv; accessible: boolean } => {
  const luminance: number[] = darkColor ? [98, 99, 100] : [2, 1, 0];
  for (const lum of luminance) {
    const onColor = getColor(originBgColor, lum);
    const contrast = getColor(onColor);
    contrast.hsluvToHex();

    const defaultContrast = getContrast(originBgColor, contrast.hex);

    if (defaultContrast >= 4.5) {
      return { onColor, accessible: true };
    }
  }

  const onColor = getColor(originBgColor, luminance.at(-1) || 0);
  return { onColor, accessible: false };
};

export const getOriginOnColors = (
  originBgColor: string,
  customFgColor?: string,
): {
  onOrigin: string;
} => {
  let originLuminanceDark = getOriginLuminanceDark(originBgColor);
  let color: string;
  const { onColor, accessible: accessibleOnColor } = getOnColorByContrast(
    originBgColor,
    originLuminanceDark,
  );
  onColor.hsluvToHex();

  color = onColor.hex;

  if (!accessibleOnColor) {
    originLuminanceDark = !originLuminanceDark;
    const { onColor: alternativeOnColor, accessible: alternativeAccessible } =
      getOnColorByContrast(originBgColor, originLuminanceDark) ??
      FALLBACK_COLOR;
    if (alternativeAccessible) {
      alternativeOnColor.hsluvToHex();
      color = alternativeOnColor.hex;
    }
  }

  if (customFgColor) {
    return {
      onOrigin: customFgColor,
    };
  } else {
    return {
      onOrigin: color,
    };
  }
};

const getOriginLuminanceDark = (origin: string): boolean => {
  const hsluv = new Hsluv();
  hsluv.hex = origin;
  hsluv.hexToHsluv();
  // We use one origin color as initial suggestion based on origin luminance
  // The user can overwrite it in ui based on the a11y tested light alternative or with a custom value

  return hsluv.hsluv_l < DARK_COLOR_LUMINANCE;
};

const getOriginBackgroundColor = (
  onOrigin: string,
  color: string,
  darkMode: boolean,
): DefaultColorType => {
  const { hoverColor, pressedColor } = getHoverPressedColors(onOrigin, color);

  const backgroundColorsLight = {
    originLightDefault: color,
    originLightHovered: hoverColor,
    originLightPressed: pressedColor,
  };

  const backgroundColorsDark = {
    originDarkDefault: color,
    originDarkHovered: hoverColor,
    originDarkPressed: pressedColor,
  };

  return {
    origin: color,
    ...(darkMode ? backgroundColorsDark : backgroundColorsLight),
  };
};

export const generateColorsByOrigin = ({
  origin,
  customFgColor,
  customBgColor,
  darkMode,
}: {
  origin: string;
  darkMode: boolean;
  customBgColor?: string;
  customFgColor?: string;
}): DefaultColorType => {
  const color = customBgColor ?? origin;

  const { onOrigin } = getOriginOnColors(color, customFgColor);

  const backgroundColors = getOriginBackgroundColor(onOrigin, color, darkMode);

  if (darkMode) {
    return {
      ...backgroundColors,
      origin,
      onOriginDarkDefault: onOrigin,
    };
  }

  return {
    ...backgroundColors,
    origin,
    onOriginLightDefault: onOrigin,
  };
};
