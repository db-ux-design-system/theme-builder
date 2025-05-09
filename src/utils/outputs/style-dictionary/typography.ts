import { ThemeTonalities, ThemeType } from "../../data.ts";
import traverse from "traverse";
import { setObjectByPath } from "./colors.ts";

export const getSDBaseIconProps = (theme: ThemeType): any => {
  const baseIconWeight = {};
  const baseIconFontSize = {};

  traverse(theme.typography).map(function (value) {
    if (
      this.isLeaf &&
      this.path.length > 0 &&
      this.path.at(-1) === "fontSize"
    ) {
      const lineHeightPath = [...this.path];
      lineHeightPath[lineHeightPath.length - 1] = "lineHeight";
      const fontSizeAsNumber = Number(value.replace("rem", ""));
      const lineHeightAsNumber = Number(
        traverse(theme.typography).get(lineHeightPath),
      );

      lineHeightPath.pop();
      lineHeightPath.pop();

      const fontSizing = lineHeightAsNumber * fontSizeAsNumber;
      setObjectByPath(
        baseIconWeight,
        [...lineHeightPath, "value"].join("."),
        fontSizing * 16,
      );
      setObjectByPath(
        baseIconWeight,
        [...lineHeightPath, "type"].join("."),
        "number",
      );
      setObjectByPath(
        baseIconFontSize,
        [...lineHeightPath, "value"].join("."),
        `${fontSizing}rem`,
      );
    }
  });

  return {
    base: {
      icon: {
        weight: baseIconWeight,
        "font-size": baseIconFontSize,
      },
    },
  };
};

const typographyKeys: string[] = ["lineHeight", "fontSize", "fontFamily", "fontWeight"];

export const traverseSABTypography = (typography: ThemeTonalities) => {
  const updatedValue: any = {
    lineHeight: {},
    fontSize: {},
    fontFamily: {},
    fontWeight: {},
  };
  const trav = traverse(typography);
  trav.map(function (value) {
    if (this.path.length === 3) {
      for (const [key, val] of Object.entries(value)) {
        for (const typoKey of typographyKeys) {
          try {
            if (!(val as any).value) {
              continue;
            }

            setObjectByPath(
              updatedValue[typoKey],
              [...this.path, key].join("."),
              {
                value: (val as any).value[typoKey],
              },
            );
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  });
  return updatedValue;
};
