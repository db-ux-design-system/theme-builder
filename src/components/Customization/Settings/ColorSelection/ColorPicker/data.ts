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

// We use this for hover/pressed
const originLuminanceDifference: number = 10;
const maxDarkLuminance = 2 * originLuminanceDifference;
const maxLightLuminance = 100 - maxDarkLuminance;

const getHoverPressedColors = (
  defaultColor: string,
  darkMode: boolean,
  origin?: string,
) => {
  let hsluv = new Hsluv();
  hsluv.hex = defaultColor;
  hsluv.hexToHsluv();
  const defaultColorLuminance = hsluv.hsluv_l;
  hsluv.hsluvToHex();
  hsluv.hex = origin ?? defaultColor;
  hsluv.hexToHsluv();

  let hoverColorLuminance: number;
  let pressedColorLuminance: number;
  if (darkMode) {
    if (
      defaultColorLuminance <=
      maxLightLuminance - originLuminanceDifference
    ) {
      hoverColorLuminance =
        defaultColorLuminance +
        originLuminanceDifference +
        originLuminanceDifference;
      pressedColorLuminance =
        defaultColorLuminance + maxDarkLuminance + originLuminanceDifference;
    } else {
      hoverColorLuminance =
        defaultColorLuminance -
        originLuminanceDifference -
        originLuminanceDifference;
      pressedColorLuminance =
        defaultColorLuminance - maxDarkLuminance - originLuminanceDifference;
    }
  } else {
    if (defaultColorLuminance >= maxDarkLuminance) {
      hoverColorLuminance = defaultColorLuminance - originLuminanceDifference;
      pressedColorLuminance = defaultColorLuminance - maxDarkLuminance;
    } else {
      hoverColorLuminance = defaultColorLuminance + originLuminanceDifference;
      pressedColorLuminance = defaultColorLuminance + maxDarkLuminance;
    }
  }

  hsluv.hsluv_l = hoverColorLuminance;
  hsluv.hsluvToHex();
  const hoverColor = hsluv.hex;
  hsluv = new Hsluv();
  hsluv.hex = origin ?? defaultColor;
  hsluv.hexToHsluv();

  hsluv.hsluv_l = pressedColorLuminance;
  hsluv.hsluvToHex();
  const pressedColor = hsluv.hex;

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
  origin: string,
  color: string,
  darkMode: boolean,
): DefaultColorType => {
  const { hoverColor, pressedColor } = getHoverPressedColors(color, darkMode);

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
    origin,
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

  const backgroundColors = getOriginBackgroundColor(origin, color, darkMode);

  if (darkMode) {
    return {
      ...backgroundColors,
      onOriginDarkDefault: onOrigin,
    };
  }

  return {
    ...backgroundColors,
    onOriginLightDefault: onOrigin,
  };
};
