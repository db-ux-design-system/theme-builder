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

const getHoverPressedForOnColors = ({
  originLuminanceDark,
  hoverPressedBasisColor,
  bgColor,
}: {
  originLuminanceDark: boolean;
  hoverPressedBasisColor: string | Hsluv;
  bgColor: string;
}) => {
  let hoveredColor = new Hsluv();
  let pressedColor = new Hsluv();

  if (originLuminanceDark) {
    for (let i = 0; i <= 100; i++) {
      hoveredColor = getColor(hoverPressedBasisColor, i);
      hoveredColor.hsluvToHex();

      const contrast = getContrast(bgColor, hoveredColor.hex);

      if (contrast > 4.5) {
        hoveredColor = getColor(hoverPressedBasisColor, i);
        pressedColor = getColor(hoverPressedBasisColor, i + 10);
        pressedColor.hsluvToHex();
        const pressedContrast = getContrast(bgColor, pressedColor.hex);
        if (pressedContrast < 4.5) {
          pressedColor = getColor(hoverPressedBasisColor, i);
        }
        hoveredColor.hsluvToHex();
        pressedColor.hsluvToHex();
        console.log(
          "dark",
          bgColor,
          hoveredColor,
          pressedColor,
          contrast,
          pressedContrast,
        );
        break;
      }
    }
  } else {
    for (let i = 100; i >= 0; i--) {
      hoveredColor = getColor(hoverPressedBasisColor, i);
      hoveredColor.hsluvToHex();

      const contrast = getContrast(bgColor, hoveredColor.hex);

      if (contrast > 4.5) {
        hoveredColor = getColor(hoverPressedBasisColor, i);
        pressedColor = getColor(hoverPressedBasisColor, i - 10);
        pressedColor.hsluvToHex();
        const pressedContrast = getContrast(bgColor, pressedColor.hex);
        if (pressedContrast < 4.5) {
          pressedColor = getColor(hoverPressedBasisColor, i);
        }
        hoveredColor.hsluvToHex();
        pressedColor.hsluvToHex();
        console.log("light", bgColor, hoveredColor, pressedColor, contrast);
        break;
      }
    }
  }

  return { hoveredColor, pressedColor };
};

export const getOriginOnColors = (
  originBgColor: string,
  customFgColor?: string,
): {
  onOrigin: string;
  hoverColor: string;
  pressedColor: string;
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
    const { hoveredColor, pressedColor } = getHoverPressedForOnColors({
      hoverPressedBasisColor: customFgColor,
      bgColor: originBgColor,
      originLuminanceDark,
    });
    return {
      onOrigin: customFgColor,
      hoverColor: hoveredColor.hex,
      pressedColor: pressedColor.hex,
    };
  } else {
    const { hoveredColor, pressedColor } = getHoverPressedForOnColors({
      originLuminanceDark,
      hoverPressedBasisColor: originBgColor,
      bgColor: originBgColor,
    });
    return {
      onOrigin: color,
      hoverColor: hoveredColor.hex,
      pressedColor: pressedColor.hex,
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

  const { onOrigin, hoverColor, pressedColor } = getOriginOnColors(
    color,
    customFgColor,
  );

  const backgroundColors = getOriginBackgroundColor(origin, color, darkMode);

  const contrastOrigin = getContrast(
    darkMode
      ? backgroundColors.originDarkDefault
      : backgroundColors.originLightDefault,
    onOrigin,
  );
  const contrastOriginHovered = getContrast(
    darkMode
      ? backgroundColors.originDarkHovered
      : backgroundColors.originLightHovered,
    onOrigin,
  );
  const contrastOriginPressed = getContrast(
    darkMode
      ? backgroundColors.originDarkPressed
      : backgroundColors.originLightPressed,
    onOrigin,
  );

  const onOriginAccessible =
    contrastOrigin === 1 ||
    (contrastOrigin >= 4.5 &&
      contrastOriginHovered >= 4.5 &&
      contrastOriginPressed >= 4.5);

  if (darkMode) {
    return {
      ...backgroundColors,
      onOriginDarkDefault: onOrigin,
      onOriginDarkHovered: hoverColor,
      onOriginDarkPressed: pressedColor,
      onOriginDarkAccessible: onOriginAccessible,
    };
  }

  return {
    ...backgroundColors,
    onOriginLightDefault: onOrigin,
    onOriginLightHovered: hoverColor,
    onOriginLightPressed: pressedColor,
    onOriginLightAccessible: onOriginAccessible,
  };
};
