import { getDomain, downSample } from '../../../src/utils';
import { Domains, CommonProps } from '../../../src/types';

const EXAMPLE_XDOMAIN: Domains['xDomain'] = [0, 1000];
const EXAMPLE_YDOMAIN: Domains['yDomain'] = [-100, 100];
const EXAMPLE_DATA: CommonProps['data'] = [
  [
    { x: 0, y: 2 },
    { x: 1, y: 10 },
    { x: 3, y: -5 },
    { x: 4, y: -1 },
    { x: 5, y: -20 },
  ],
];

describe('Utils Unit Tests', () => {
  context('getDomain', () => {
    it('will return domains when default domains are provided', () => {
      const { derivedXDomain, derivedYDomain } = getDomain(
        EXAMPLE_XDOMAIN,
        EXAMPLE_YDOMAIN,
        []
      );
      expect(derivedXDomain[0]).to.eq(EXAMPLE_XDOMAIN[0]);
      expect(derivedXDomain[1]).to.eq(EXAMPLE_XDOMAIN[1]);
      expect(derivedYDomain[0]).to.eq(EXAMPLE_YDOMAIN[0]);
      expect(derivedYDomain[1]).to.eq(EXAMPLE_YDOMAIN[1]);
    });

    it('will calculate only xDomain', () => {
      const { derivedXDomain, derivedYDomain } = getDomain(
        null,
        EXAMPLE_YDOMAIN,
        EXAMPLE_DATA
      );
      expect(derivedXDomain[0]).to.eq(0);
      expect(derivedXDomain[1]).to.eq(5);
      expect(derivedYDomain[0]).to.eq(EXAMPLE_YDOMAIN[0]);
      expect(derivedYDomain[1]).to.eq(EXAMPLE_YDOMAIN[1]);
    });

    it('will calculate only yDomain', () => {
      const { derivedXDomain, derivedYDomain } = getDomain(
        EXAMPLE_XDOMAIN,
        null,
        EXAMPLE_DATA
      );
      expect(derivedXDomain[0]).to.eq(EXAMPLE_XDOMAIN[0]);
      expect(derivedXDomain[1]).to.eq(EXAMPLE_XDOMAIN[1]);
      expect(derivedYDomain[0]).to.eq(-20);
      expect(derivedYDomain[1]).to.eq(20);
    });
  });

  context('downSample', () => {
    it('will filter points by down sampling', () => {
      const downSampledData = downSample(EXAMPLE_DATA, 2);
      expect(downSampledData[0][0].x).to.eq(0);
      expect(downSampledData[0][0].y).to.eq(2);
      expect(downSampledData[0][1].x).to.eq(4);
      expect(downSampledData[0][1].y).to.eq(-1);
    });
  });
});
