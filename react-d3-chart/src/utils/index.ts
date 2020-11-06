import {CommonProps, Domains, LineProps} from '../types';

/**
 * Down sample points so that each line has the respective number of maxPoints
 * @param data Data points
 * @param maxPoints the max number of points that should be dsiplayed for any
 *     line
 * @returns The resulting filtered data points
 */
export const downSample = (data: LineProps[], maxPoints: number) => {
  if (data.length > 0) {
    return data.map((line) => {
      const k = Math.ceil(line.length / maxPoints);
      return line.filter((_, i) => i % k === 0);
    });
  }
  return [];
};

/**
 * Will return the smallest and largest values over any line for the given
 * dimension
 * @param data Data points
 * @param dimension Calculate bounds for this dimension
 * @returns The calculated lower and upper bounds for the given dimension and
 *     data points
 */
const getDomainHelper =
    (data: CommonProps['data'], dimension: 'x'|'y'): Domains['xDomain'] => {
      return [
        Math.floor(data.reduce(
            (minSoFar, currLine) => Math.min(
                minSoFar,
                currLine.reduce(
                    (minVal, currCoord) =>
                        Math.min(minVal, currCoord[dimension]),
                    0)),
            0)),
        Math.round(data.reduce(
            (maxSoFar, currLine) => Math.max(
                maxSoFar,
                currLine.reduce(
                    (minVal, currCoord) =>
                        Math.max(minVal, currCoord[dimension]),
                    0)),
            0)),
      ];
    };

/**
 * Function that will calculate the x and y domains of a graph if not provided.
 * - x lower bound: smallest x value
 * - x upper bound: largest x value
 * - y lower bound: -1 * largest absolute y value
 * - y upper bound: largest absolute y value
 * @param xDomain Optional user provided x axis domain
 * @param yDomain Optional user provided y axis domain
 * @param data  Data points
 * @returns
 * - derivedXDomain: Calculated x axis domain
 * - derivedYDomain: Caluclated y axis domain
 */
export const getDomain =
    (xDomain: Domains['xDomain'], yDomain: Domains['yDomain'],
     data: CommonProps['data']): {
      derivedXDomain: Domains['xDomain']; derivedYDomain: Domains['yDomain'];
    } => {
      let derivedXDomain: Domains['xDomain'],
          derivedYDomain: Domains['yDomain'];
      if (xDomain) {
        derivedXDomain = xDomain;
      } else {
        derivedXDomain = getDomainHelper(data, 'x');
      }

      if (yDomain) {
        derivedYDomain = yDomain;
      } else {
        derivedYDomain = getDomainHelper(data, 'y');
        const maxAbsYVal =
            Math.max(Math.abs(derivedYDomain[0]), Math.abs(derivedYDomain[1]));
        derivedYDomain = [-maxAbsYVal, maxAbsYVal];
      }
      return {derivedXDomain, derivedYDomain};
    };

/**
 * Get matrix domain
 * @param matrix
 * @returns [min, max]
 */
export const getMatrixDomain =
    (matrix: Array<Array<number>>): [number, number] => {
      let min = Infinity;
      let max = -Infinity;

      matrix.forEach(subArray => {subArray.forEach(num => {
                       min = Math.min(num, min);
                       max = Math.max(num, max);
                     })});
      return [min, max]
    };

/**
 * Google Color 20c color getter
 * @param n
 * @returns string
 */
export const googleColor20c = (n: number): string => {
  const colors = [
    '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477',
    '#66aa00', '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc',
    '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'
  ];
  return colors[n % colors.length]
}
