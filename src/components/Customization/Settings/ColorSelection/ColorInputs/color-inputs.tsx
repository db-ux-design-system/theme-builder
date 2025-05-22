import {
  DBButton,
  DBDivider,
  DBInfotext,
  DBInput,
} from "@db-ux/react-core-components";
import { ColorInputsType } from "./data.ts";
import { useTranslation } from "react-i18next";

const ColorInputs = ({
  name,
  color,
  hoveredColor,
  pressedColor,
  onColorChange,
  error,
  alternative,
  contrastGroups,
}: ColorInputsType) => {
  const { t } = useTranslation();
  const colors    = [color, hoveredColor, pressedColor];
  const labelKeys = ["colorDefault", "colorHovered", "colorPressed"];
  return (
    <>
      <DBDivider />
      <span className="font-bold">{name}</span>
      {contrastGroups?.map((contrastGroup, indexGroup) => (
        <div
          className="flex flex-col gap-fix-2xs"
          key={`${name}-contrast-group-${indexGroup}`}
        >
          {contrastGroup.groupName && (
            <small className="text-adaptive-on-basic-emphasis-80-default">
              {contrastGroup.groupName}
            </small>
          )}
          <div className="flex flex-wrap gap-fix-sm">
            {contrastGroup.contrasts.map((contrast, index) => (
              <DBInfotext
                key={`${name}-contrast-${index}`}
                semantic={
                  contrast.value < (contrast.min ?? 3)
                    ? "critical"
                    : "successful"
                }
                size="small"
              >
                {contrast.name ? `${contrast.name}: ` : ""}
                {contrast.value.toFixed(2)}:1
              </DBInfotext>
            ))}
          </div>
        </div>
      ))}
      { colors
        .filter((color) => Boolean(color))
        .map((color, index) => (
          <div
            key={`color-input-${name}-${index}`}
            className="grid grid-cols-2 gap-fix-md"
          >
            <DBInput
              label={t(labelKeys[index])}
              type="color"
              readOnly={index !== 0}
              value={color}
              onChange={(event) => {
                if (index === 0) {
                  onColorChange?.(event.target.value);
                }
              }}
            />

            <DBInput
              label={t("colorInputHex")}
              placeholder={t("colorInputHex")}
              value={color}
              readOnly={index !== 0}
              onChange={(event) => {
                if (index === 0) {
                  onColorChange?.(event.target.value);
                }
              }}
            />
          </div>
        ))}

      {error && <DBInfotext semantic="warning">{t(error)}</DBInfotext>}
      {alternative && (
        <div className="grid grid-cols-2 gap-fix-md">
          <div
            className="w-full h-full text-[0]"
            style={{ backgroundColor: alternative }}
          >
            {alternative}
          </div>
          <DBButton
            onClick={() => {
              onColorChange?.(alternative);
            }}
          >
            {t("overwrite")}
          </DBButton>
        </div>
      )}
    </>
  );
};

export default ColorInputs;
