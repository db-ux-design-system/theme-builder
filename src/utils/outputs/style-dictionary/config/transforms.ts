import { Transform } from "style-dictionary/types";
import { SEMANTIC_COLOR } from "../../../data.ts";

export const CSS_SEMANTIC_COLORS_NAME = "css/semantic-colors";
export const SemanticColorsTransform: Transform = {
  name: CSS_SEMANTIC_COLORS_NAME,
  type: "value",
  filter: (token) => token.type === SEMANTIC_COLOR,
  transform: (token, { prefix }) => {
    let lightVar = `var(--${[prefix, ...token.value.light].join("-")})`;
    let darkVar = `var(--${[prefix, ...token.value.dark].join("-")})`;

    if (token.value.transparencyDark) {
      darkVar = `color-mix(in srgb, transparent ${token.value.transparencyDark}%, ${darkVar})`;
    }

    if (token.value.transparencyLight) {
      lightVar = `color-mix(in srgb, transparent ${token.value.transparencyLight}%, ${lightVar})`;
    }

    return `light-dark(${lightVar},${darkVar})`;
  },
};

export const CSS_SHADOW = "css/shadow";
export const ShadowTransform: Transform = {
  name: CSS_SHADOW,
  type: "value",
  filter: (token) => token.type === "shadow",
  transform: (token) => {
    // Allow both single and multi shadow tokens:
    const shadows = Array.isArray(token.value) ? token.value : [token.value];

    const transformedShadows = shadows.map((shadow) => {
      const { blur, spread, color, type, offsetX, offsetY } = shadow;

      return `${type ? `${type} ` : ""} ${offsetX ?? 0}px ${offsetY ?? 0}px ${blur ?? 0}px ${
        spread ? `${spread}px ` : ""
      }${color ?? `#000000`}`;
    });

    return transformedShadows.join(", ");
  },
};
