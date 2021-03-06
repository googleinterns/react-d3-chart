// LineChart Component
/**
 * File containing the top level LineChart component
 * @packageDocumentation
 */
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
  TRangeSelection,
} from '../../types';
import { DEFAULT_COLOR } from '../../theme';
import { downSample, getDomain } from '../../utils';
import BaseChart from './BaseChart';
import { LineChartContainer } from './styles';
import ModeSelectionContainer from '../ModeSelectionContainer';

const CONTEXT_HEIGHT = 40;

interface State {
  tooltipState: TooltipState;
  domainState: DomainState;
  rangeSelectionState: RangeSelectionState;
  mode: ModeTypes;
}

/** LineChart's own props */
export interface LineChartSelfProps {
  /** Current graph view mode */
  viewMode?: 'overlapped' | 'stacked';
  /** Callback called when confirmed rangeSelections change */
  selectionCallback?: (selections: Array<TRangeSelection>) => void;
  /** Padding to add to either end of the yDomain */
  yDomainPadding?: number;
  /** Maximum number of points to be displayed in the context per line */
  maxContextPoints?: number;
}

/** All LineChart Props */
export type LineChartProps = LineChartSelfProps &
  Dimensions &
  Partial<Domains> &
  Partial<
    Pick<
      CommonProps,
      'color' | 'maxPoints' | 'tooltipEntryHeight' | 'contextHeight'
    >
  > &
  Pick<CommonProps, 'data'>;

/**
 *
 * @param data Original Data Set to be filtered
 * @param selectedDomain Upper and lower bound domain restriction on the data set
 * @returns Filtered data set
 */
const filterDomain = (
  data: CommonProps['data'],
  selectedDomain: DomainState['selectedDomain']
) =>
  data.map((line) => {
    return line.filter(
      (d) => d.x >= selectedDomain[0] && d.x <= selectedDomain[1]
    );
  });

/** LineChart Component */
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
  maxContextPoints = 1000,
  selectionCallback,
  tooltipEntryHeight,
  yDomainPadding = 50,
}) => {
  const [mode, setMode] = useState<ModeTypes>('intersection');
  const { derivedXDomain, derivedYDomain } = useMemo(() => {
    const { derivedXDomain, derivedYDomain } = getDomain(
      xDomain,
      yDomain,
      data
    );
    return {
      derivedXDomain,
      derivedYDomain: [
        derivedYDomain[0] - yDomainPadding,
        derivedYDomain[1] + yDomainPadding,
      ],
    };
  }, [xDomain, yDomain, data]);
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    enabled: false,
    xOffset: 0,
    xScaled: 0,
  });
  const [rangeSelectionState, setRangeSelectionState] = useState<
    RangeSelectionState
  >({ selection: [0, 0], eventSource: '' });
  const [rangeSelections, setRangeSelections] = useState<Array<TRangeSelection>>([]);

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
    selectionCallback(rangeSelections);
  }, [selectionCallback, rangeSelections]);

  useEffect(() => {
    setDomainState({
      selectedDomain: derivedXDomain,
      eventSource: '',
    });
  }, [width, height, derivedXDomain, derivedYDomain, viewMode]);

  const domainFilteredData = filterDomain(data, selectedDomain);
  const filteredData = downSample(domainFilteredData, maxPoints);
  const contextData = useMemo(() => downSample(data, maxContextPoints), [data]);

  const getChart = (
    data: CommonProps['data'],
    filteredData: CommonProps['data'],
    contextData: CommonProps['data'],
    index: number
  ) => (
    <div key={`linechart-container-${index}`}>
      <BaseChart
        width={width}
        height={height}
        data={data}
        filteredData={filteredData}
        contextData={contextData}
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
        rangeSelections={rangeSelections}
        tooltipEntryHeight={tooltipEntryHeight}
        mode={mode}
        key={`linechart-${index}`}
      />
      <ModeSelectionContainer
        selectMode={changeMode}
        width={width + margin.left + margin.right}
        mode={mode}
        setRangeSelectionState={setRangeSelectionState}
        selection={rangeSelectionState.selection}
        rangeSelections={rangeSelections}
        setRangeSelections={setRangeSelections}
        onConfirmSelection={(selection: TRangeSelection) => {
          setRangeSelections(
            [...rangeSelections, selection]
          );
        }}
      />
    </div>
  );

  return (
    <LineChartContainer>
      {viewMode === 'overlapped' &&
        getChart(data, filteredData, contextData, 0)}
      {viewMode === 'stacked' &&
        filteredData.map((line, index) =>
          getChart([data[index]], [line], [contextData[index]], index)
        )}
    </LineChartContainer>
  );
};

export default LineChart;
