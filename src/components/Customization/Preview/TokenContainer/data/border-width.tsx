import { DBInfotext } from "@db-ux/react-core-components";
import { DEFAULT_SIZES } from "./index.tsx";

const BorderWidth = () => (
  <div className="grid grid-cols-3 md:grid-cols-9 gap-fix-md">
    {DEFAULT_SIZES.map((name) => (
      <div
        className="flex flex-col h-full justify-between items-center"
        key={`border-width-${name}`}
      >
        <div
          className="rounded w-siz-xl"
          style={{
            height: `var(--db-border-width-${name})`,
            border: `var(--db-border-width-${name}) solid var(--db-brand-on-bg-basic-emphasis-60-default)`,
          }}
        />
        <DBInfotext semantic="informational" icon="none">
          {name}
        </DBInfotext>
      </div>
    ))}
  </div>
);

export default BorderWidth;
