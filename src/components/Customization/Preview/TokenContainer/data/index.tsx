import { ReactElement } from "react";
import BorderWidth from "./border-width.tsx";
import BorderRadius from "./border-radius.tsx";
import Elevation from "./elevation.tsx";
import Sizing from "./sizing.tsx";
import Spacing from "./spacing.tsx";

export type TokenComponentType = {
  title: string;
  component: ReactElement;
  isColor?: boolean;
};

export type ColorsPropsType = {
  colorName: string;
};

export const ELEVATION_SIZES = ["sm", "md", "lg"];

export const DEFAULT_SIZES = [
  "3xs",
  "2xs",
  "xs",
  ...ELEVATION_SIZES,
  "xl",
  "2xl",
  "3xl",
];

export const tokenComponents: TokenComponentType[] = [
  { title: "spacing", component: <Spacing /> },
  { title: "sizing", component: <Sizing /> },
  { title: "elevation", component: <Elevation /> },
  { title: "borderWidth", component: <BorderWidth /> },
  { title: "borderRadius", component: <BorderRadius /> },
];
