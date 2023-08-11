import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { ContrastCheckerType } from "./data";
import ColorPicker from "../ColorPicker";
import "./index.scss";
import { DBDivider } from "@db-ui/react-components";
import { getContrastSuggestion, getWCA2Variant } from "../../utils";
import ContrastList from "../ContrastList";
import InformationButton from "../InformationButton";
import chroma from "chroma-js";

const ContrastChecker = ({
  label,
  backgroundColor,
  initColor,
  onChange,
}: PropsWithChildren<ContrastCheckerType>) => {
  const [foregroundColor, setFourgroundColor] = useState<string>(initColor);
  const [suggestion4, setSuggestion4] = useState<string | undefined>();
  const [suggestion7, setSuggestion7] = useState<string | undefined>();

  useEffect(() => {
    if (foregroundColor) {
      onChange?.(foregroundColor);
    }
  }, [foregroundColor]);

  useEffect(() => {
    if (foregroundColor && backgroundColor) {
      setSuggestion4(getContrastSuggestion(backgroundColor, foregroundColor));
      setSuggestion7(
        getContrastSuggestion(backgroundColor, foregroundColor, 7.5),
      );
    }
  }, [foregroundColor, backgroundColor]);

  return (
    <div className="contrast-checker-container">
      <ColorPicker
        variant={getWCA2Variant(
          chroma.contrast(foregroundColor, backgroundColor),
        )}
        label={label}
        color={foregroundColor}
        setColor={setFourgroundColor}
      />
      <InformationButton>
        <>
          <p>Original:</p>
          <ContrastList
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
          />
          {(suggestion4 || suggestion7) && (
            <>
              <DBDivider />
              <p>Suggestions:</p>

              {suggestion4 && (
                <ContrastList
                  backgroundColor={backgroundColor}
                  foregroundColor={suggestion4}
                />
              )}

              {suggestion7 && (
                <ContrastList
                  backgroundColor={backgroundColor}
                  foregroundColor={suggestion7}
                />
              )}
            </>
          )}
        </>
      </InformationButton>
    </div>
  );
};

export default ContrastChecker;
