import {
  ColorType,
  CustomColorMappingType,
  DefaultColorMappingType,
  DefaultThemeType,
  SpeakingName,
} from "../utils/data.ts";

export const THEME_BUILDER_STATE = "theme-builder-state";

export type ThemeBuilderState = {
  defaultColors: DefaultColorMappingType;
  customColors: CustomColorMappingType;
  colors: ColorType[];
  darkMode: boolean;
  resetDefaults: () => void;
  editorMarkup: string;
  notification?: string;
  defaultTheme: DefaultThemeType;
  speakingNames: SpeakingName[];
};
