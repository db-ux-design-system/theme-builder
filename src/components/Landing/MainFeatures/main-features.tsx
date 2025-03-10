import { DBSection } from "@db-ux/react-core-components";
import { useTranslation } from "react-i18next";

const cards: string[] = ["accessible", "adaptive", "efficient"];

const MainFeatures = () => {
  const { t } = useTranslation();
  return (
    <>
      {cards.map((card, index) => (
        <DBSection
          key={`feature-card-${card}`}
          spacing="medium"
          width="large"
          className={`flex h-[100vh] items-center${index % 2 === 0 ? " db-color-neutral db-bg-color-basic-level-2" : ""}`}
        >
          <div className="flex flex-col text-balance text-center items-center gap-fix-md">
            <h6>{t(`landingHowItFeature${index + 1}Title`)}</h6>
            <h2>
              {t(`landingHowItFeature${index + 1}Strong`)}
              {t(`landingHowItFeature${index + 1}Desc`)}
            </h2>
          </div>
        </DBSection>
      ))}
    </>
  );
};

export default MainFeatures;
