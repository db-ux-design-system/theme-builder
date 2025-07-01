import { dbTheme, sabTheme, sBahnTheme } from "../src/store/themes";
import {
  getSDColorPalette,
  getSDSpeakingColors,
} from "../src/utils/outputs/style-dictionary/colors";
import { getSDBaseIconProps } from "../src/utils/outputs/style-dictionary/typography";
import { mergeObjectsRecursive } from "../src/utils";
import {
  DefaultColorType,
  defaultLuminances,
  speakingNamesDefaultMapping,
} from "../src/utils/data";
import {
  deleteUnusedProps,
  getSabStyleDictionary,
} from "../src/utils/outputs/style-dictionary";

type ThemeName = "DB" | "SBahn" | "sab";

const getTheme = (theme: ThemeName) => {
  switch (theme) {
    case "DB":
      return dbTheme;
    case "SBahn":
      return sBahnTheme;
    case "sab":
      return sabTheme;
    default:
      throw Error(`Unknown theme: ${theme}`);
  }
};

export const generateStyleDictionary = (
  themeName: ThemeName,
  speakingNames = speakingNamesDefaultMapping,
  luminanceSteps = defaultLuminances,
) => {
  const theme = getTheme(themeName);

  const allColors: Record<string, DefaultColorType> = {
    ...theme.colors,
    ...theme.additionalColors,
    ...theme.customColors,
  };

  const sdColorPalette = getSDColorPalette(allColors, luminanceSteps);
  const sdSpeakingColors = getSDSpeakingColors(speakingNames, allColors);

  if (themeName === "sab") {
    return getSabStyleDictionary(theme, sdColorPalette, sdSpeakingColors);
  }

  const finalTheme = {
    ...getSDBaseIconProps(theme),
    ...theme,
    ...mergeObjectsRecursive(sdColorPalette, sdSpeakingColors),
  };
  deleteUnusedProps(finalTheme);

  return finalTheme;
};
