export type ContrastType = {
  value: number;
  min?: number;
  name?: string;
};

export type ColorInputsType = {
  name: string;
  color: string;
  hoveredColor?: string;
  pressedColor?: string;
  onColorChange?: (color: string) => void;
  error?: string;
  alternative?: string;
  contrastGroups?: { groupName?: string; contrasts: ContrastType[] }[];
};
