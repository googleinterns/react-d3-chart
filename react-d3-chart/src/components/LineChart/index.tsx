import React, { useState, useMemo, useEffect } from 'react';
import * as d3 from 'd3';
import {
  Dimensions,
  TooltipState,
  RangeSelectionState,
  DomainState,
  CommonProps,
  Domains,
  ModeTypes,
} from '../../types';
import { DEFAULT_COLOR } from '../../theme';
import { downSample, getDomain } from '../../utils';
import BaseChart from './BaseChart';
import { LineChartContainer } from './styles';
import ModeSelectionContainer from '../ModeSelectionContainer';

const CONTEXT_HEIGHT = 40;

export interface State {
  tooltipState: TooltipState;
  domainState: DomainState;
  rangeSelectionState: RangeSelectionState;
  mode: ModeTypes;
}

interface SelfProps {
  lineClassName?: string;
  contextHeight?: number;
  viewMode?: 'overlapped' | 'stacked';
  selectionCallback?: (selection: RangeSelectionState['selection']) => void;
}

export type LineChartProps = SelfProps &
  Dimensions &
  Partial<Domains> &
  Partial<Pick<CommonProps, 'color' | 'maxPoints' | 'tooltipEntryHeight'>> &
  Pick<CommonProps, 'data'>;

const filterDomain = (
  data: CommonProps['data'],
  selectedDomain: DomainState['selectedDomain']
) =>
  data.map((line) => {
    return line.filter(
      (d) => d.x >= selectedDomain[0] && d.x <= selectedDomain[1]
    );
  });

export const LineChart: React.FC<LineChartProps> = ({
  width,
  height,
  xDomain,
  yDomain,
  data,
  margin,
  contextHeight = CONTEXT_HEIGHT,
  viewMode = 'overlapped',
  color = DEFAULT_COLOR,
  maxPoints = 150,
  selectionCallback,
  tooltipEntryHeight,
}) => {
  const [mode, setMode] = useState<ModeTypes>('intersection');
  const { derivedXDomain, derivedYDomain } = useMemo(
    () => getDomain(xDomain, yDomain, data),
    [xDomain, yDomain, data]
  );
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    enabled: false,
    xOffset: 0,
    xScaled: 0,
  });
  const [rangeSelectionState, setRangeSelectionState] = useState<
    RangeSelectionState
  >({ selection: [0, 0], eventSource: '' });
  const [domainState, setDomainState] = useState<DomainState>({
    selectedDomain: derivedXDomain,
    eventSource: '',
  });
  const { selectedDomain } = domainState;
  const xScale = useMemo(
    () => d3.scaleLinear().domain(selectedDomain).range([0, width]),
    [width, selectedDomain]
  );
  const xScaleContext = useMemo(
    () => d3.scaleLinear().range([0, width]).domain(derivedXDomain),
    [width, derivedXDomain]
  );
  const yScale = useMemo(
    () => d3.scaleLinear().range([height, 0]).domain(derivedYDomain),
    [height, derivedYDomain]
  );
  const yScaleContext = useMemo(
    () => d3.scaleLinear().range([contextHeight, 0]).domain(derivedYDomain),
    [contextHeight, derivedYDomain]
  );

  const changeDomain = (domainState: DomainState) => {
    setRangeSelectionState({
      selection: [0, 0],
      eventSource: domainState.eventSource,
    });
    setDomainState(domainState);
  };

  const changeMode = (mode: ModeTypes) => {
    if (mode === 'selection') {
      setRangeSelectionState({ selection: [0, 0], eventSource: '' });
    }
    setMode(mode);
  };

  useEffect(() => {
    const { selection } = rangeSelectionState;
    if (selectionCallback && selection[1] - selection[0] > 0) {
      selectionCallback(selection);
    }
  }, [selectionCallback, rangeSelectionState.selection]);

  useEffect(() => {
    setDomainState({
      selectedDomain: derivedXDomain,
      eventSource: '',
    });
  }, [width, height, derivedXDomain, derivedYDomain, viewMode]);

  const domainFilteredData = filterDomain(data, selectedDomain);
  const filteredData = downSample(domainFilteredData, maxPoints);

  const getChart = (
    data: CommonProps['data'],
    filteredData: CommonProps['data'],
    index: number
  ) => (
    <div key={`linechart-container-${index}`}>
      <BaseChart
        width={width}
        height={height}
        data={data}
        filteredData={filteredData}
        margin={margin}
        contextHeight={contextHeight}
        color={color}
        xScale={xScale}
        yScale={yScale}
        xScaleContext={xScaleContext}
        yScaleContext={yScaleContext}
        graphIndex={index}
        tooltipState={tooltipState}
        setTooltipState={setTooltipState}
        domainState={domainState}
        setDomainState={changeDomain}
        rangeSelectionState={rangeSelectionState}
        setRangeSelectionState={setRangeSelectionState}
        tooltipEntryHeight={tooltipEntryHeight}
        mode={mode}
        key={`linechart-${index}`}
      />
      <ModeSelectionContainer
        selectMode={changeMode}
        width={width + margin.left + margin.right}
        mode={mode}
        selection={rangeSelectionState.selection}
      />
    </div>
  );

  return (
    <LineChartContainer>
      {viewMode === 'overlapped' && getChart(data, filteredData, 0)}
      {viewMode === 'stacked' &&
        filteredData.map((line, index) =>
          getChart([data[index]], [line], index)
        )}
    </LineChartContainer>
  );
};

export default LineChart;
