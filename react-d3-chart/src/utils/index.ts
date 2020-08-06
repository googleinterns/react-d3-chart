import { LineProps } from '../components/types';

export const downSample = (data: LineProps[], maxPoints: number) => {
  if (data.length > 0) {
    return data.map((line) => {
      const k = Math.ceil(line.length / maxPoints);
      return line.filter((_, i) => i % k === 0);
    });
  }
  return [];
};
