import { Format, TransformedToken } from "style-dictionary/types";

const getSyntax = (token: TransformedToken) => {
    // TODO: Length isn't working with `rem`... https://developer.mozilla.org/en-US/docs/Web/CSS/@property/syntax#length
  /*if (token.type === "dimension") {
    return "length";
  }*/
  if (token.type === "color") {
    return "color";
  }

  return "*";
};

export const CssPropertyFormat: Format = {
  name: "cssPropertyFormat",
  format: ({ dictionary }) => {
    return dictionary.allTokens
      .map((token: TransformedToken) => {
        const syntax = getSyntax(token);
        const syntaxValue = syntax === "*" ? syntax : `<${syntax}>`;
        return `@property --${token.name} { 
  syntax: "${syntaxValue}"; 
  initial-value: ${token.value}; 
  inherits: true; 
}

`;
      })
      .join("");
  },
};

export const CssAppOverwriteFormat: Format = {
  name: "cssAppOverwriteFormat",
  format: ({ dictionary }) => {
    return dictionary.allTokens
      .map(
        (token: TransformedToken) =>
          `--${token.name}:${token.value};
`,
      )
      .join("");
  },
};
