export interface LineProps {
  colour: string;
  coordinates: Array<Coordinate>;
}

export interface Dimensions {
  width: number;
  height: number;
  margin: Margin;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BisectorTooltipEntry {
  colour: string;
  y: number;
}
