export type DefaultColorType = {
  origin: string;
  originLightAccessible?: boolean;
  originLightDefault?: string;
  originLightHovered?: string;
  originLightPressed?: string;
  onOriginLightAccessible?: boolean;
  onOriginLightDefault?: string;
  onOriginLightHovered?: string;
  onOriginLightPressed?: string;
  originDarkAccessible?: boolean;
  originDarkDefault?: string;
  originDarkHovered?: string;
  originDarkPressed?: string;
  onOriginDarkAccessible?: boolean;
  onOriginDarkDefault?: string;
  onOriginDarkHovered?: string;
  onOriginDarkPressed?: string;

  /**
   * @deprecated
   */
  originHSLBgDark?: string;

  /**
   * @deprecated
   */
  originHSLBgLight?: string;

  /**
   * @deprecated
   */
  onOriginLightAlternative?: string;
  /**
   * @deprecated
   */
  originDarkAlternative?: string;
  /**
   * @deprecated
   */
  onOriginDarkAlternative?: string;
  /**
   * @deprecated
   */
  originLightAlternative?: string;
};

export type DefaultColorMappingType = {
  neutral: DefaultColorType;
  brand: DefaultColorType;
  informational: DefaultColorType;
  successful: DefaultColorType;
  warning: DefaultColorType;
  critical: DefaultColorType;
};

export type AdditionalColorMappingType = {
  yellow: DefaultColorType;
  orange: DefaultColorType;
  red: DefaultColorType;
  pink: DefaultColorType;
  violet: DefaultColorType;
  blue: DefaultColorType;
  cyan: DefaultColorType;
  turquoise: DefaultColorType;
  green: DefaultColorType;
};

export type ThemeValue<T> = {
  value: T;
  type?: string;
};

export type ThemeTypographyType = {
  lineHeight: number;
  fontSize: string;
  fontFamily?: string;
};

export type ThemeSizing = {
  _scale?: ThemeValue<string>;
  "2xl"?: ThemeValue<string> | ThemeValue<ThemeTypographyType>;
  "2xs"?: ThemeValue<string> | ThemeValue<ThemeTypographyType>;
  "3xl"?: ThemeValue<string> | ThemeValue<ThemeTypographyType>;
  "3xs"?: ThemeValue<string> | ThemeValue<ThemeTypographyType>;
  lg?: ThemeValue<string> | ThemeValue<ThemeTypographyType>;
  md?: ThemeValue<string> | ThemeValue<ThemeTypographyType>;
  sm?: ThemeValue<string> | ThemeValue<ThemeTypographyType>;
  xl?: ThemeValue<string> | ThemeValue<ThemeTypographyType>;
  xs?: ThemeValue<string> | ThemeValue<ThemeTypographyType>;
};

export type ThemeTypography = {
  headline: ThemeSizing;
  body: ThemeSizing;
};

export type ThemeDevices = {
  desktop: ThemeSizing | ThemeTypography;
  tablet: ThemeSizing | ThemeTypography;
  mobile: ThemeSizing | ThemeTypography;
};

export type ThemeTonalities = {
  regular: ThemeDevices | ThemeSizing;
  functional: ThemeDevices | ThemeSizing;
  expressive: ThemeDevices | ThemeSizing;
};

export type ThemeBorder = {
  radius: ThemeSizing;
  height: ThemeSizing;
};

export type SizingFixedType = {
  fixed: {
    mobile: {
      header: ThemeValue<string>;
    };
  };
};

export type TransitionType = {
  duration: {
    "x-slow": ThemeValue<string>;
    slow: ThemeValue<string>;
    medium: ThemeValue<string>;
    fast: ThemeValue<string>;
    "x-fast": ThemeValue<string>;
  };
  timing: Record<string, ThemeValue<string>>;
  straight: Record<string, ThemeValue<string>>;
};

export type FontType = {
  name: string;
  localName: string;
  localShortName: string;
  family: string;
  weight: number;
  woff2: string;
};
export type FontsType = {
  family: {
    sans: ThemeValue<string>;
    head: ThemeValue<string>;
  };
  sans: Record<string, FontType>;
  head: Record<string, FontType>;
};

export type BrandingType = {
  name: string;
  image: {
    light: string;
    dark: string;
  };
};

export type ElevationValueType = {
  blur: number;
  spread: number;
  color: string;
};

export type ElevationType = {
  _scale?: ThemeValue<string>;
  md?: ThemeValue<ElevationValueType[]>;
  sm?: ThemeValue<ElevationValueType[]>;
  lg?: ThemeValue<ElevationValueType[]>;
};

export type ThemeType = {
  branding: BrandingType;
  spacing: {
    responsive: ThemeTonalities;
    fixed: ThemeTonalities;
  };
  sizing: ThemeTonalities & SizingFixedType;
  typography: ThemeTonalities;
  elevation: ElevationType;
  border: ThemeBorder;
  colors: DefaultColorMappingType;
  additionalColors: AdditionalColorMappingType;
  customColors?: Record<string, DefaultColorType>;
  transition: TransitionType;
  font: FontsType;
};

export const defaultLuminances: number[] = [
  4, 8, 14, 20, 26, 32, 40, 50, 60, 70, 80, 90, 94, 96, 98,
];

export type HeisslufType = {
  name?: string;
  index?: number;
  hex: string;
  hue: number;
  saturation: number;
  luminance: number;
};

export const SEMANTIC_COLOR = "semantic-color";

export type SpeakingName = {
  name: string;
  light: number;
  dark: number;
  transparencyLight?: number;
  transparencyDark?: number;
};

export const speakingNamesDefaultMapping: SpeakingName[] = [
  {
    name: "bg-basic-transparent-full-default",
    dark: 9,
    light: 6,
    transparencyDark: 100,
    transparencyLight: 100,
  },
  {
    name: "bg-basic-transparent-semi-default",
    dark: 9,
    light: 6,
    transparencyDark: 84,
    transparencyLight: 84,
  },
  {
    name: "bg-basic-transparent-hovered",
    dark: 9,
    light: 6,
    transparencyDark: 76,
    transparencyLight: 76,
  },
  {
    name: "bg-basic-transparent-pressed",
    dark: 9,
    light: 6,
    transparencyDark: 68,
    transparencyLight: 68,
  },
  { name: "on-bg-basic-emphasis-100-default", dark: 12, light: 1 },
  { name: "on-bg-basic-emphasis-100-hovered", dark: 10, light: 3 },
  { name: "on-bg-basic-emphasis-100-pressed", dark: 9, light: 5 },
  { name: "on-bg-basic-emphasis-90-default", dark: 10, light: 5 },
  { name: "on-bg-basic-emphasis-90-hovered", dark: 9, light: 6 },
  { name: "on-bg-basic-emphasis-90-pressed", dark: 8, light: 7 },
  { name: "on-bg-basic-emphasis-80-default", dark: 9, light: 6 },
  { name: "on-bg-basic-emphasis-80-hovered", dark: 8, light: 5 },
  { name: "on-bg-basic-emphasis-80-pressed", dark: 7, light: 4 },
  { name: "on-bg-basic-emphasis-70-default", dark: 8, light: 7 },
  { name: "on-bg-basic-emphasis-70-hovered", dark: 7, light: 6 },
  { name: "on-bg-basic-emphasis-70-pressed", dark: 6, light: 5 },
  { name: "on-bg-basic-emphasis-60-default", dark: 6, light: 10 },
  { name: "on-bg-basic-emphasis-60-hovered", dark: 5, light: 9 },
  { name: "on-bg-basic-emphasis-60-pressed", dark: 4, light: 8 },
  { name: "on-bg-basic-emphasis-50-default", dark: 5, light: 9 },
  { name: "on-bg-basic-emphasis-50-hovered", dark: 4, light: 8 },
  { name: "on-bg-basic-emphasis-50-pressed", dark: 3, light: 7 },
  { name: "bg-inverted-contrast-max-default", dark: 12, light: 1 },
  { name: "bg-inverted-contrast-max-hovered", dark: 10, light: 3 },
  { name: "bg-inverted-contrast-max-pressed", dark: 9, light: 4 },
  { name: "bg-inverted-contrast-high-default", dark: 10, light: 6 },
  { name: "bg-inverted-contrast-high-hovered", dark: 11, light: 4 },
  { name: "bg-inverted-contrast-high-pressed", dark: 12, light: 3 },
  { name: "bg-inverted-contrast-low-default", dark: 8, light: 7 },
  { name: "bg-inverted-contrast-low-hovered", dark: 10, light: 5 },
  { name: "bg-inverted-contrast-low-pressed", dark: 11, light: 4 },
  { name: "on-bg-inverted-default", dark: 3, light: 14 },
  { name: "on-bg-inverted-hovered", dark: 1, light: 12 },
  { name: "on-bg-inverted-pressed", dark: 0, light: 11 },
  { name: "bg-vibrant-default", dark: 9, light: 9 },
  { name: "bg-vibrant-hovered", dark: 10, light: 10 },
  { name: "bg-vibrant-pressed", dark: 11, light: 11 },
  { name: "on-bg-vibrant-default", dark: 1, light: 1 },
  { name: "on-bg-vibrant-hovered", dark: 3, light: 3 },
  { name: "on-bg-vibrant-pressed", dark: 4, light: 4 },
];
