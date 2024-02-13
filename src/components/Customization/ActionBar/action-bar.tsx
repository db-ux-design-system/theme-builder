import { DBButton } from "@db-ui/react-components";
import { useThemeBuilderStore } from "../../../store";
import { downloadTheme } from "../../../utils";
import { useTranslation } from "react-i18next";

const ActionBar = () => {
  const { t } = useTranslation();
  const {
    defaultColors,
    resetDefaults,
    luminanceSteps,
    defaultTheme,
    customColors,
    speakingNames,
  } = useThemeBuilderStore((state) => state);

  return (
    <>
      <DBButton
        icon="undo"
        onClick={() => resetDefaults()}
        title={t("resetDesc")}
      >
        {t("reset")}
      </DBButton>
      <DBButton
        variant="primary"
        icon="download"
        onClick={() =>
          downloadTheme(
            speakingNames,
            luminanceSteps,
            defaultTheme,
            defaultColors,
            customColors,
          )
        }
        title={t("downloadDesc")}
      >
        {t("download")}
      </DBButton>
    </>
  );
};

export default ActionBar;
