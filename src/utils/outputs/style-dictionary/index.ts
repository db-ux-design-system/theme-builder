import { DirectoryJSON, Volume } from "@bundled-es-modules/memfs";
import StyleDictionary, { type Config } from "style-dictionary";
import { CustomCssTransFormGroup } from "./config/transform-groups.ts";
import { CssAppOverwriteFormat, CssPropertyFormat } from "./config/formats.ts";
import {
  SemanticColorsTransform,
  ShadowTransform,
} from "./config/transforms.ts";
import { getSDBaseIconProps, traverseSABTypography } from "./typography.ts";
import { mergeObjectsRecursive } from "../../index.ts";
import { ThemeType } from "../../data.ts";

StyleDictionary.registerFormat(CssPropertyFormat);
StyleDictionary.registerFormat(CssAppOverwriteFormat);
StyleDictionary.registerTransform(SemanticColorsTransform);
StyleDictionary.registerTransform(ShadowTransform);
StyleDictionary.registerTransformGroup(CustomCssTransFormGroup);

export const runStyleDictionary = async (config: Config) => {
  const volume = new Volume();
  const sd = new StyleDictionary(config, { volume });
  await sd.buildAllPlatforms();

  return volume.toJSON();
};

export const convertDirectoryJsonToFiles = (
  directoryJSON: DirectoryJSON<string | null>,
) =>
  Object.entries(directoryJSON).flatMap(([path, content]) => {
    if (!content) {
      return [];
    }
    return new File([content], path);
  });

export const deleteUnusedProps = (sdConfig: any) => {
  delete sdConfig.branding;
  delete sdConfig.colors;
  delete sdConfig.customColors;
  delete sdConfig.additionalColors;
};

export const getSabStyleDictionary = (
  theme: ThemeType,
  sdColorPalette: any,
  sdSpeakingColors: any,
): object => {
  const sdConfig = {
    ...getSDBaseIconProps(theme),
    ...theme,
  };
  deleteUnusedProps(sdConfig);
  sdConfig.colors = mergeObjectsRecursive(sdColorPalette, sdSpeakingColors);
  sdConfig.typography = traverseSABTypography(sdConfig.typography);
  return sdConfig;
};
