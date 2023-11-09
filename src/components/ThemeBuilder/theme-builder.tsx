import { useTranslation } from "react-i18next";
import { ReactElement, useState } from "react";
import ColorSelection from "../Colors/ColorSelection";
import { DBAccordionItem, DBButton } from "@db-ui/react-components";
import ComponentPreview from "../Colors/ComponentPreview";
import ColorTable from "../Colors/ColorTable";
import ShirtSelection from "./ShirtSelection";

type AccordionItemType = {
  title: string;
  component: ReactElement;
};

const accordion: AccordionItemType[] = [
  { title: "colors", component: <ColorSelection /> },
  {
    title: "elevation",
    component: (
      <ShirtSelection
        label="elevation"
        params={["elevation"]}
        shirtSizes={["sm", "md", "lg"]}
        isTextArea
      />
    ),
  },
  {
    title: "borderRadius",
    component: (
      <ShirtSelection
        label="borderRadius"
        params={["border", "radius"]}
        shirtSizes={["sm", "md", "lg", "3xl"]}
      />
    ),
  },
];

const ThemeBuilder = () => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<boolean>(true);

  const [openAccordion, setOpenAccordion] = useState<number>(0);

  return (
    <div className="content flex flex-col md:flex-row md:h-full md:overflow-hidden">
      <div className="flex flex-col p-res-xs w-full md:w-2/5 md:h-full md:overflow-auto">
        <h2 className="mb-fix-sm" data-variant="light">
          {t("createThemeHeadline")}
        </h2>
        {accordion.map((item, index) => (
          <DBAccordionItem
            key={`${item.title}-${index}`}
            title={t(item.title)}
            open={openAccordion === index}
            onToggle={(open) => {
              if (open) {
                setOpenAccordion(index);
              } else if (openAccordion === index) {
                setOpenAccordion(-1);
              }
            }}
          >
            {item.component}
          </DBAccordionItem>
        ))}
      </div>
      <div
        className="db-bg-neutral-transparent-semi p-fix-sm md:p-res-sm
      flex flex-col gap-res-sm w-full md:h-full md:overflow-auto"
      >
        <div className="flex gap-fix-3xs">
          <DBButton
            variant={preview ? "outlined" : "text"}
            onClick={() => setPreview(true)}
          >
            {t("preview")}
          </DBButton>
          <DBButton
            variant={!preview ? "outlined" : "text"}
            onClick={() => setPreview(false)}
          >
            {t("colors")}
          </DBButton>
        </div>
        {preview ? <ComponentPreview /> : <ColorTable />}
      </div>
    </div>
  );
};

export default ThemeBuilder;
