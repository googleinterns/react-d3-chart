import { DomainPropObjectType } from 'victory-core';
export type LineProps = Array<Coordinate>;

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
  color: string;
  y: number;
}

export interface RangeSelectionState {
  domain: DomainPropObjectType;
  enabled: boolean;
}

export type ModeTypes = 'selection' | 'intersection';
