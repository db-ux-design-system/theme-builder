import { CSS_SEMANTIC_COLORS_NAME, CSS_SHADOW } from "./transforms.ts";

export type TransformGroup = {
  name: string;
  transforms: string[];
};

export const CustomCssTransFormGroup: TransformGroup = {
  name: "custom/css",
  transforms: [
    "attribute/cti",
    "name/kebab",
    "time/seconds",
    "html/icon",
    "size/rem",
    "color/css",
    "asset/url",
    "fontFamily/css",
    "cubicBezier/css",
    "strokeStyle/css/shorthand",
    "border/css/shorthand",
    "typography/css/shorthand",
    "transition/css/shorthand",
  ].concat([CSS_SEMANTIC_COLORS_NAME, CSS_SHADOW]),
};
