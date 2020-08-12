import React, { useState, useMemo, useEffect } from 'react';
import * as d3 from 'd3';
import {
  Dimensions,
  TooltipState,
  DomainState,
  CommonProps,
  Domains,
} from '../../types';
import { DEFAULT_COLOR } from '../../theme';
import { downSample, getDomain } from '../../utils';
import BaseChart from './BaseChart';
import { LineChartContainer } from './styles';

const CONTEXT_HEIGHT = 40;

export interface State {
  tooltipState: TooltipState;
  domainState: DomainState;
}

interface SelfProps {
  lineClassName?: string;
  contextHeight?: number;
  viewMode?: 'stacked' | 'overlapped';
}

export type LineChartProps = SelfProps &
  Dimensions &
  Partial<Domains> &
  Partial<Pick<CommonProps, 'color' | 'maxPoints'>> &
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
}) => {
  const { derivedXDomain, derivedYDomain } = useMemo(
    () => getDomain(xDomain, yDomain, data),
    [xDomain, yDomain, data]
  );
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    enabled: false,
    xOffset: 0,
    xScaled: 0,
  });
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

  useEffect(() => {
    setDomainState({
      selectedDomain: derivedXDomain,
      eventSource: '',
    });
  }, [width, height, derivedXDomain, derivedYDomain, viewMode]);

  const domainFilteredData = filterDomain(data, selectedDomain);
  const filteredData = downSample(domainFilteredData, maxPoints);

  return (
    <LineChartContainer>
      {viewMode === 'overlapped' && (
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
          tooltipState={tooltipState}
          setTooltipState={setTooltipState}
          domainState={domainState}
          setDomainState={setDomainState}
        />
      )}
      {viewMode === 'stacked' &&
        filteredData.map((line, index) => (
          <BaseChart
            width={width}
            height={height}
            data={[data[index]]}
            filteredData={[line]}
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
            setDomainState={setDomainState}
            key={`linechart-${index}`}
          />
        ))}
    </LineChartContainer>
  );
};

export default LineChart;
