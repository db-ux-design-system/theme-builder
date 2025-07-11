import {
  DBButton,
  DBHeader,
  DBPage,
  DBTooltip,
} from "@db-ux/react-core-components";
import { useThemeBuilderStore } from "../../store";
import { DefaultPagePropsType } from "./data.ts";
import { PropsWithChildren, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getThemeImage } from "../../utils/image.ts";

const DefaultPage = ({
  name,
  children,
  actionBar,
  className,
  density,
  navigation,
  withDevMode,
}: PropsWithChildren<DefaultPagePropsType>) => {
  const { t } = useTranslation();
  const { theme, darkMode, developerMode } = useThemeBuilderStore(
    (state) => state,
  );
  const [drawerOpen, setDrawerOpen] = useState<boolean>();

  return (
    <div
      className="contents"
      data-density={density || "regular"}
      data-mode={darkMode ? "dark" : "light"}
    >
      <DBPage
        className={className}
        variant="fixed"
        data-color="neutral"
        header={
          <DBHeader
            drawerOpen={drawerOpen}
            onToggle={() => setDrawerOpen(!drawerOpen)}
            brand={
              <div className="db-brand">
                <Link to={"/"}>
                  <img
                    className="logo"
                    src={getThemeImage(
                      darkMode && theme.branding.image.dark
                        ? theme.branding.image.dark
                        : theme.branding.image.light,
                    )}
                    alt="brand"
                  />
                </Link>
                {name}
              </div>
            }
            secondaryAction={actionBar}
            primaryAction={
              <div className="flex gap-fix-sm">
                {withDevMode && (
                  <DBButton
                    className={!developerMode ? "opacity-0" : ""}
                    icon="wrench"
                    variant="ghost"
                    noText
                    onClick={() =>
                      useThemeBuilderStore.setState({
                        developerMode: !developerMode,
                      })
                    }
                  >
                    Developer Mode
                    <DBTooltip placement="bottom">
                      {t(developerMode ? "disableDevMode" : "enableDevMode")}
                    </DBTooltip>
                  </DBButton>
                )}
                <DBButton
                  variant="ghost"
                  icon={darkMode ? "sun" : "moon"}
                  noText
                  className="p-0 w-siz-md"
                  onClick={() => {
                    useThemeBuilderStore.setState({ darkMode: !darkMode });
                  }}
                >
                  {darkMode ? "🌞" : "🌛"}
                  <DBTooltip placement="left">
                    {t(darkMode ? "enableLightMode" : "enableDarkMode")}
                  </DBTooltip>
                </DBButton>
              </div>
            }
          >
            {navigation}
          </DBHeader>
        }
      >
        {children}
      </DBPage>
    </div>
  );
};

export default DefaultPage;
