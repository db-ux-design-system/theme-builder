import { DBSection } from "@db-ui/react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <DBSection
      variant="medium"
      size="large"
      className="flex items-center db-brand-bg-lvl-3"
    >
      <div className="flex flex-col gap-fix-xl items-center text-center text-balance">
        <h2 data-icon-after="heart">{t("landingMoreTitle")}</h2>
        <div className="flex flex-col md:flex-row gap-fix-md mx-auto items-center">
          <Link
            to="/playground"
            className="db-button"
            target="_blank"
            data-variant="solid"
            data-width="full"
          >
            {t("tryIt")}
          </Link>
          <a
            className="db-button"
            data-variant="primary"
            href="https://marketingportal.extranet.deutschebahn.com/marketingportal"
            target="_blank"
            data-width="full"
          >
            {t("gettingStarted")}
          </a>
        </div>
      </div>
    </DBSection>
  );
};

export default Footer;
